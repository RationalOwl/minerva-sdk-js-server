import { Request } from './Request';

export abstract class Event extends Request {

    constructor(data: any){
        super(data);
    }
}