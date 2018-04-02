import { ConsoleEvent, ConsoleEventJson } from "./ConsoleEvent";
import * as _ from "lodash";



export type ConsoleJobEventParam = {
    arc: number,
    syncT: number,
    ast: number
}

export abstract class ConsoleJobEvent extends ConsoleEvent {

    constructor(data: ConsoleEventJson | string | number) {
        super(data);
    }

    public getAsyncResultCode(): number {
        return this.mJson.pm.arc;
    }

    // public setAsyncResultCode(mAsyncResultCode: number) {
    //     this.mJson.pm.arc = mAsyncResultCode;
    // }


    // public setSyncTime(syncTime: number) {
    //     this.mJson.pm.syncT = syncTime;
    // }


    public getSyncTime(): number {
        return this.mJson.pm.syncT;
    }


    // public setAsyncTime(asyncTime: number) {
    //     this.mJson.pm.ast = asyncTime;
    // }


    public getAsyncTime(): number {
        return this.mJson.pm.ast;
    }
}