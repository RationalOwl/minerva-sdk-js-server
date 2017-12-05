import { Request } from '../../../Request';
import { MinervaProtocol } from "../../../MinervaProtocol";



export type DeviceGrpCreateReqParam = {
    sId: string,
    sRId: string,
    gn: string,
    dl: string[],
    gd: string,
}

export class DeviceGrpCreateReq extends Request {

    constructor() {
        super(MinervaProtocol.DEVICE_GRP_CREATE_CMD_ID);

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


    public getGroupName(): string {
        return this.mReqJson.pm.gn;
    }


    public setGroupName(groupName: string) {
        this.mReqJson.pm.gn = groupName;
    }



    public getDeviceList(): string[] {
        return this.mReqJson.pm.dl;
    }


    public setDeviceList(deviceList: string[]) {
        this.mReqJson.pm.dl = deviceList;
    }


    public getGroupDesc(): string {
        return this.mReqJson.pm.gd;
    }


    public setGroupDesc(groupDesc: string) {
        this.mReqJson.pm.gd = groupDesc;
    }
}