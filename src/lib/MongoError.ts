export default class MongoError {
    name: string;
    message: string;
    stack: string;
    constructor(error: any) {
        this.name = error.name || "UnknownMongoError";
        this.message = error.message || "Unknown error occurred while executing Mongo query";
        this.stack = error.stack || "";
    }
    public toObj() {
        return {
            name: this.name,
            message: this.message,
            stack: this.stack,
        };
    }
}
