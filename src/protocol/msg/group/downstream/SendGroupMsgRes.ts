import { Response } from '../../../Response';


export type SendBroadcastMsgResParam = {
    mId: string,
}

export class SendGroupMsgRes extends Response {
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