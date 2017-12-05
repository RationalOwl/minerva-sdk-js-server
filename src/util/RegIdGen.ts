import { Response } from "../protocol/Response";
import { Request } from "../protocol/Request";
import { ConsoleJobEvent } from "../protocol/ConsoleJobEvent";

export class RegIdGen {


    public static getRequestId(req: Request): string {
        return req.getCmdId() + "" + req.getSrcTime();
    }

    public static getResponseId(res: Response): string {
        return res.getCmdId() + "" + res.getSrcTime();
    }

    public static getAsyncRequestId(asyncRes: ConsoleJobEvent): string {
        return (asyncRes.getCmdId() - 11000) + "" + asyncRes.getSrcTime();
    }
}
