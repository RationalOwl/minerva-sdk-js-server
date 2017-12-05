import { Response } from '../../../Response';
import { Request } from '../../../Request';
import { MinervaProtocol } from '../../../MinervaProtocol';


export type SendBroadcastMsgReqParam = {
    mId: string;
}

export class SendMulticastMsgRes extends Response {

    constructor(resJSON: any) {
        super(resJSON);
    }

    public getMsgId(): string {
        return this.mResJson.pm.mId;
    }

    public setMsgId(msgId: string) {
        this.mResJson.pm.mId = msgId;
    }
}