import Dictionary from "./Dictionary";

/**
 * Wraps the data of the original request since it does not exist past the initial uws handler
 */
export default class RequestData {
    constructor(
        public headers: Dictionary<string>,
        public method: string,
        public data: string,
    ) { }
}