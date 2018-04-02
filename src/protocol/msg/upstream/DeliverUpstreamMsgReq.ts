import { Request } from '../../Request';
import { MinervaProtocol } from "../../MinervaProtocol";



export type SendBroadcastMsgReqParam = {
    sId: string,
    msgs: any[],
    dRId: string,
    mId: string,
    data: string,
    svrT: string,
}


export class DeliverUpstreamMsgReq extends Request {

    constructor(reqJSON: any) {
        super(reqJSON);
    }

    public getMsgs(): any[] {
        return this.mReqJson.pm.msgs;
    }


    // public setMsgs(msgs: any[]) {
    //     this.mReqJson.pm.msgs = msgs;
    // }


    public getServiceId(): string {
        return this.mReqJson.pm.sId;
    }


    // public setServiceId(mServiceId: string) {
    //     this.mReqJson.pm.sId = mServiceId;
    // }
}