import { Request } from '../../../Request';
import { MinervaProtocol } from '../../../MinervaProtocol';



export type SendBroadcastMsgReqParam = {
    sId: string,
    sRId: string,
    gId: string,
    data: string,
    q: number,
    nt?: string;
    nb?: string;
}


export class SendGroupMsgReq extends Request {
    constructor() {
        super(MinervaProtocol.MSG_SEND_GROUP_CMD_ID);
    }


    public getServiceId(): string {
        return this.mReqJson.pm.sId;
    }

    public setServiceId(serviceId: string) {
        this.mReqJson.pm.sId = serviceId;
    }


    public getServerRegId(): string {
        return this.mReqJson.pm.sRId;
    }


    public setServerRegId(serverRegId: string) {
        this.mReqJson.pm.sRId = serverRegId;
    }


    public getDeviceGroupId(): string {
        return this.mReqJson.pm.gId;
    }


    public setDeviceGroupId(mDeviceGroupId: string) {
        this.mReqJson.pm.gId = mDeviceGroupId;
    }

    public getData(): string {
        return this.mReqJson.pm.data;
    }


    public setData(data: string) {
        this.mReqJson.pm.data = data;
    }


    public getSupportMsgQ(): number {
        return this.mReqJson.pm.q;
    }


    public setSupportMsgQ(mSupportMsgQ: number) {
        this.mReqJson.pm.q = mSupportMsgQ;
    }


    public getNotiTitle(): string {
        return this.mReqJson.pm.nt;
    }

    public setNotiTitle(mNotiTitle: string) {
        this.mReqJson.pm.nt = mNotiTitle;
    }

    public getNotiBody(): string {
        return this.mReqJson.pm.nb;
    }

    public setNotiBody(mNotiBody: string) {
        this.mReqJson.pm.nb = mNotiBody;
    }

}