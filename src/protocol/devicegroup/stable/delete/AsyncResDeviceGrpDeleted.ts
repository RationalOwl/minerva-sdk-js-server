import { ConsoleJobEvent } from "../../../ConsoleJobEvent";



export type AsyncResDeviceGrpCreatedParam = {
    arc: number,
    syncT: number,
    ast: number

    sId: string;
    gId: string;
}


export class AsyncResDeviceGrpDeleted extends ConsoleJobEvent {

    constructor(reqJSON: any) {
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

}