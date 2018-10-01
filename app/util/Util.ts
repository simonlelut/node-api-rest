import {Request, Response} from 'express';

class Util{


    public getQuery = (query, acceptRange, res, countAll) =>{

        
        

        let end: number, start: number, range: number;

        //TODO: test query
        if(query){

            query = query.split("-");
            start = query[0];
            end = query[1];

            range = end - start;
        }

        if(start === undefined || end === undefined || range > acceptRange || range <= 0 || start >= end){
            res.status(400).json({reason : "Requested range not allowed"});
            throw new Error("Requested range not allowed")
        }

        res.setHeader("Content-Range", `${start}-${end}/${countAll}`);

        return { 
            "end"   : end, 
            "start" : start,
            "range" : range
        }
    }

    public setPagination = (end: number, start: number,range: number, countAll: number, req: Request, res : Response) => {
        let uri = req.app.get('config').uri + "/users";

        //toujours
        let header = `<${uri}?range=0-${range}>; rel="first"`; 

        //si on 
        if(start > 0 && start - range != 0)
            header += `,<${uri}?range=${start - range}-${start}>; rel="prev"`;
        
        if( range * 2 < countAll){
            header += `,<${uri}?range=${Number(start) + range}-${Number(end) + range }>; rel="next"`;
            header += `,<${uri}?range=${countAll - range}-${countAll}>; rel="last"`;
        }
        else if(end != countAll)
            header += `,<${uri}?range=${end}-${countAll}>; rel="next"`;
        
        res.setHeader("Link",header);
    }

}

export default new Util();