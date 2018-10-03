import {Request, Response} from 'express';
import {getConnection} from "typeorm";

class Util{


    public getQuery = async (query: string, res: Response, req: Request, classe: any)=>{

        res.setHeader("Accept-Range", `${req.app.get('config').maxRangePagination}`);
        
        let result: any = {}, queries: string[]

        //TODO: test query
        if(query){

            queries= query.split("-");
            result.start = Number(queries[0]);
            result.end = Number(queries[1]);

            result.range = result.end - result.start;

            if(result.start === undefined || 
                result.end === undefined || 
                result.range > req.app.get('config').maxRangePagination || 
                result.range <= 0 || 
                result.start >= result.end){

                res.status(400).json({reason : "Requested range not allowed"});
                return;
            }
        }
        else {
            result.start    = 0;
            result.end      = req.app.get('config').defaultPaginationRange;
            result.range    = req.app.get('config').defaultPaginationRange;
        }

        result.countAll = await getConnection().getRepository(classe).count();
        res.setHeader("Content-Range", `${result.start}-${result.end}/${result.countAll}`);

        return result;
    }

    public setPagination = (query: any, req: Request, res : Response) => {

        let start = query.start;
        let range = query.range;
        let countAll = query.countAll;
        let end = query.end;
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