import { Request } from '../../../Request';
import { MinervaProtocol } from '../../../MinervaProtocol';


export type DeviceGrpCreateReqParam = {
    sId: string,
    sRId: string,
    gId: string,
    dl: string[],
}

export class DeviceGrpSubtractReq extends Request {

    constructor() {
        super(MinervaProtocol.DEVICE_GRP_SUBTRACT_CMD_ID);
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


    public getGrpId(): string {
        return this.mReqJson.pm.gId;
    }


    public setGrpId(mGrpId: string) {
        this.mReqJson.pm.gId = mGrpId;
    }

    public getDeviceList(): string[] {
        return this.mReqJson.pm.dl;
    }


    public setDeviceList(deviceList: string[]) {
        this.mReqJson.pm.dl = deviceList;
    }
}