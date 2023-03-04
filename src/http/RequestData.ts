import Dictionary from "../misc/Dictionary";
import { HttpResponse, RecognizedString } from 'uWebSockets.js'

/**
 * Wraps the data of the original request since it does not exist past the initial uws handler
 */
export default class RequestData {

    private _hasEnded = false;
    [key: string]: any;

    constructor(
        public headers: Dictionary<string>,
        public method: string,
        public data: string,
        public query: string,
        public internalResponse: HttpResponse
    ) { }

    /**
     * Add a header to the response.
     * @param key 
     * @param value 
     * @returns If write was successful
     */
    public writeHeader(key: RecognizedString, value: RecognizedString): boolean {
        if (this._hasEnded) return false;
        this.internalResponse.writeHeader(key, value);
        return true;
    }

    /**
     * Add a status to the response.
     * For example 200 OK or 404 Not Found
     * @param status
     * @returns If write was successful
     */
    public writeStatus(status: RecognizedString = '200 OK'): boolean {
        if (this._hasEnded) return false;
        this.internalResponse.writeStatus(status);
        return true;
    }

    /**
     * Add a chunk of data to the response.
     * @param status
     * @returns If write was successful
     */
    public write(chunk: RecognizedString): boolean {
        if (this._hasEnded) return false;
        this.internalResponse.write(chunk);
        return true;
    }

    /**
     * Add a chunk of data to the response and end the response.
     * The response cannot be written to after this.
     * @param body
     * @param closeConnection
     * @returns If write was successful
     */
    public end(body: RecognizedString, closeConnection = false): boolean {
        if (this._hasEnded) return false;
        this.internalResponse.end(body, closeConnection);
        return true;
    }

    public hasEnded(): boolean {
        return this._hasEnded;
    }
}