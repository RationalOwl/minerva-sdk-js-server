import { Request } from '../../../Request';
import { MinervaProtocol } from '../../../MinervaProtocol';


export type SendBroadcastMsgReqParam = {
    sId: string,
    sRId: string,
    dRIds: string[],
    data: string,
    q: number,
    nt?: string;
    nb?: string;
}

export class SendMulticastMsgReq extends Request {

    constructor() {
        super(MinervaProtocol.MSG_SEND_MULTICAST_CMD_ID);
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


    public getDeviceRegIds(): string[] {
        return this.mReqJson.pm.dRIds;
    }


    public setDeviceRegIds(deviceRegIds: string[]) {
        this.mReqJson.pm.dRIds = deviceRegIds;
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