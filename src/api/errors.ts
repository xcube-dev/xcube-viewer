export class HTTPError extends Error {
    readonly statusCode: number;

    constructor(statusCode: number, statusMessage: string) {
        super(statusMessage);
        this.statusCode = statusCode;
    }
}