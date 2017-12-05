import { Response } from './Response';

export abstract class EventRes extends Response {

    constructor(data: any, resultCode?: number){
        super(data, resultCode);
    }
}