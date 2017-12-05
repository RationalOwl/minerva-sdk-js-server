import { ConsoleJobEvent } from "../../../ConsoleJobEvent";




export type AsyncResDeviceGrpCreatedParam = {
    arc: number,
    syncT: number,
    ast: number

    sId: string;
    gId: string;
    tds: number;
    sds: number;
    fd: string[];
}

export class AsyncResDeviceGrpSubtracted extends ConsoleJobEvent {

    constructor(reqJSON: any) {
        super(reqJSON);
    }

    public getServiceId(): string {
        return this.mJson.pm.sId;
    }


    public setServiceId(serviceId: string) {
        this.mJson.pm.sId = serviceId;
    }



    public getGrpId(): string {
        return this.mJson.pm.gId;
    }


    public setGrpId(mGrpId: string) {
        this.mJson.pm.gId = mGrpId;
    }


    public getTotalDeviceSize(): number {
        return this.mJson.pm.tds;
    }


    public setTotalDeviceSize(mDeviceSize: number) {
        return this.mJson.pm.tds = mDeviceSize;
    }

    public getSubtractDeviceSize(): number {
        return this.mJson.pm.sds;
    }


    public setSubtractDeviceSize(mSubtractDeviceSize: number) {
        return this.mJson.pm.sds = mSubtractDeviceSize;
    }


    public getFailedDevices(): string[] {
        return this.mJson.pm.fd;
    }


    public setFailedDevices(mFailedDevices: string[]) {
        this.mJson.pm.fd = mFailedDevices;
    }

}