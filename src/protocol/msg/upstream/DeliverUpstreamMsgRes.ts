import { Request } from '../../Request';
import { Response } from '../../Response';



export type SendBroadcastMsgReqParam = {
    sId: string,
    sRId: string,
    mIds: string[],
}


export class DeliverUpstreamMsgRes extends Response {

    constructor(req: Request, resultCode: number) {
        super(req, resultCode);
    }

    public getServiceId(): string {
        return this.mResJson.pm.sId;
    }


    public setServiceId(mServiceId: string) {
        this.mResJson.pm.sId = mServiceId;
    }


    public getMsgIds(): string[] {
        return this.mResJson.pm.mIds;
    }


    public setMsgIds(mMsgIds: string[]) {
        this.mResJson.pm.mIds = mMsgIds;
    }


    public getServerRegId(): string {
        return this.mResJson.pm.sRId;
    }


    public setServerRegId(mServerRegId: string) {
        this.mResJson.pm.sRId = mServerRegId;
    }
}