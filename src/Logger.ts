

// let logger = console;
let logger = { log: () => { }, debug: ()=> {} };

export function setLogger(_logger: any) {
    logger = _logger;
}

export const Logger: any = logger;