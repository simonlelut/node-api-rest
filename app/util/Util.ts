import {Request, Response} from 'express';
import _ from 'lodash';

class Util{
   


    public getQuery = async ( res: Response, req: Request)=>{
        let query = req.query;
        
        let result: any = {};

        result.maxPerPage = req.app.get('config').maxPerPage;

        //default
        result.page = query.page ? query.page : 1;
        result.skip = 0; 
        result.per_page = query.per_page ? query.per_page : req.app.get('config').defaultPerPage;
        result.skip = (result.page - 1) * result.per_page;
        delete query.per_page;
        delete query.page;

        if(result.per_page > result.maxPerPage){
            
            res.status(400).json({reason : "Requested per_page not allowed"});
            return;
        }
        //tri
        if(query.sort){
            result.sort = query.sort.split(",")
            
            let order = [];

            //pour chaque variables a trier
            result.sort.map(sort =>{
                order[sort] = "ASC"    
                //si elle est aussi dans 'desc' alors tri descendant sinon tris ascendant
                if(query.desc){
                    query.desc.split(',').map(desc =>{
                        if(desc === sort)
                            order[sort] = "DESC";
                    })
                }
            });

            result.order = order;
            delete query.sort;
            delete query.desc;
        }
        
        // non specific query (exemple: name, date)
        if(! _.isEmpty(query)){
            
            result.filter = "";

            Object.keys(query).map(word =>{
                switch (word) {
                    case "year":
                        result.filter +=  ` date_part('year', create_at) ${query[word]} and`;
                        break;
                    case "month":
                        result.filter +=  ` date_part('month', create_at) ${query[word]} and`;
                        break;
                    case "day":
                        result.filter +=  ` date_part('day', create_at) ${query[word]} and`;
                        break;
                
                    default:
                        result.filter += ` ${word} like '${query[word]}' and`
                        break;
                }
            })
            //delete last and
            result.filter = result.filter.substring(0, result.filter.length - 3);
        }

        return result;
    }

    getMeta(data, count: number) {

        data.countAll = count;
        data.numberPages = Math.floor(data.countAll / data.per_page);
        data.numberPages = data.numberPages === 0 ? 1 : data.numberPages;
        return {
            "total_count"       : data.countAll,
            "limit_per_pages"   : data.maxPerPage,
            'number_pages'      : data.numberPages,
            'current_per_pages' : data.per_page   
        }
    }
}

export default new Util();