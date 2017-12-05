import { ConsoleJobEvent } from "../../../ConsoleJobEvent";



export type AsyncResDeviceGrpCreatedParam = {
    arc: number,
    syncT: number,
    ast: number

    sId: string;
    gId: string;
    ds: number;
    fd: string[];
}


export class AsyncResDeviceGrpCreated extends ConsoleJobEvent {

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


    public getDeviceSize(): number {
        return this.mJson.pm.ds;
    }


    public setDeviceSize(mDeviceSize: number) {
        this.mJson.pm.ds = mDeviceSize;
    }


    public getFailedDevices(): string[] {
        return this.mJson.pm.fd;
    }


    public setFailedDevices(mFailedDevices: string[]) {
        this.mJson.pm.fd = mFailedDevices;
    }
}