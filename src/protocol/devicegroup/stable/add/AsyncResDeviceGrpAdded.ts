import { ConsoleEventJson } from "../../../ConsoleEvent";
import { ConsoleJobEvent } from "../../../ConsoleJobEvent";



export type AsyncResDeviceGrpAddedParam = {
    arc: number,
    syncT: number,
    ast: number

    sId: string;
    gId: string;
    tds: number;
    ads: number;
    fd: string[];
}

export class AsyncResDeviceGrpAdded extends ConsoleJobEvent {

    constructor(reqJSON: ConsoleEventJson) {
        super(reqJSON);
    }


    public getServiceId(): string {
        return this.mJson.pm.sId;
    }


    // public setServiceId(serviceId: string) {
    //     this.mJson.pm.sId = serviceId;
    // }

    public getGrpId(): string {
        return this.mJson.pm.gId;
    }


    // public setGrpId(mGrpId: string) {
    //     this.mJson.pm.gId = mGrpId;
    // }


    public getTotalDeviceSize(): number {
        return this.mJson.pm.tds;
    }


    // public setTotalDeviceSize(mDeviceSize: number) {
    //     this.mJson.pm.tds = mDeviceSize;
    // }

    public getAddedDeviceSize(): number {
        return this.mJson.pm.ads;
    }


    // public setAddedDeviceSize(mAddedDeviceSize: number) {
    //     this.mJson.pm.ads = mAddedDeviceSize;
    // }


    public getFailedDevices(): string[] {
        return this.mJson.pm.fd;
    }


    // public setFailedDevices(mFailedDevices: string[]) {
    //     this.mJson.pm.fd = mFailedDevices;
    // }
}