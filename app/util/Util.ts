import {Request, Response} from 'express';
import {getConnection, Like} from "typeorm";
import async from 'async';
import _ from 'lodash';

class Util{


    public getQuery = async (query: Request["query"], res: Response, req: Request, classe: any)=>{

        res.setHeader("Accept-Range", `${req.app.get('config').maxRangePagination}`);
        
        let result: any = {}, queries: string[]


        //default
        result.start    = 0;
        result.end      = req.app.get('config').defaultPaginationRange;
        result.range    = req.app.get('config').defaultPaginationRange;

        if(query.range){

            queries= query.range.split("-");
            result.start = Number(queries[0]);
            result.end = Number(queries[1]);

            result.range = result.end - result.start;

            delete query.range;

            if(result.start === undefined || 
                result.end === undefined || 
                result.range > req.app.get('config').maxRangePagination || 
                result.range <= 0 || 
                result.start >= result.end){

                res.status(400).json({reason : "Requested range not allowed"});
                return;
            }
        }

        //tri
        if(query.sort){
            result.sort = query.sort.split(",")
            
            let order = [];

            async.forEachOf(result.sort, (_sort, key)=>{
                 //si query.sort et query.desc alors descendant, sinon ascendant
                 if(query.desc && query.desc.includes(result.sort[key]))
                 order[result.sort[key]] = "DESC"
             else
                 order[result.sort[key]] = "ASC"
            })

            result.order = order;
            delete query.sort;
            delete query.desc;
        }
        
        // non specific query (exemple: name, date)
        if(! _.isEmpty(query)){
            
            if( query.year ||  query.month|| query.day )

                result.filter =  `date_part('${Object.keys(query)}', create_at) = ${Object.keys(query).map(i => query[i])[0]}`;

            else{
                result.filter = Object.keys(query);
                let keys = Object.keys(query).map(i => query[i]);
                
                let filters = [];
                
                async.forEachOf(result.filter, (_filter, key)=>{
                    
                    filters[result.filter[key]] = Like(keys[key])
                })
    
                result.filter = Object.assign({}, filters);
            }
            
        }

        let data = await getConnection().getRepository(classe)           
            .findAndCount({
                where: result.filter,
                order: result.order,
                skip : result.start,
                take : result.range
            });

        result.countAll = data[1]

        res.setHeader("Content-Range", `${result.start}-${result.end}/${result.countAll}`);

        return {
            query: result,
            results: data[0]
        }
    }

    public setPagination = (query: any, req: Request, res : Response) => {

        let start = query.start;
        let range = query.range;
        let end = query.end;
        let countAll = query.countAll;
        let uri = req.app.get('config').uri + "/users";
        let header: string = "";

        if(start != 0)
            header += `<${uri}?range=0-${range}>; rel="first",`; 

        if(start > 0 && start - range > 0)
            header += `<${uri}?range=${start - range}-${start}>; rel="prev",`;
        
        if( range * 2 < countAll && end < countAll){
            header += `<${uri}?range=${start + range}-${end + range }>; rel="next",`;
            header += `<${uri}?range=${countAll - range}-${countAll}>; rel="last",`;
        }
        else if(end != countAll && end < countAll)
            header += `<${uri}?range=${end}-${countAll}>; rel="next",`;
        
        res.setHeader("Link",header.substring(0, header.length - 1));
    }

}

export default new Util();