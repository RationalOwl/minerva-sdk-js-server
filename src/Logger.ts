

let logger = console;

export function setLogger(_logger: any){
    logger = _logger;
}

export const Logger: any = logger;