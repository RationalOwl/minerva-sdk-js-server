import { Response } from '../../../Response';

export class ServerUnregRes extends Response {
    constructor(resJSON: string) {
        super(resJSON);
    }
}