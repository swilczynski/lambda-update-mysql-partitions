module.exports = class RequestsRepository {
    constructor(db) {
        this.db = db;
    }

    async getMinRequestId() {
        if (this.minRequestId != null) {
            return this.minRequestId;
        }

        this.minRequestId = 0;

        const query = 'select min(requestID) as min_requestid from requests';

        const results = await this.db.query(query);

        await this.db.end();

        if (results.length > 0) {
            this.minRequestId = results[0].min_requestid;
        }

        return this.minRequestId;
    }

    async getMaxRequestId() {
        if (this.maxRequestId != null) {
            return this.maxRequestId;
        }

        this.maxRequestId = 0;

        const query = 'select max(requestID) as max_requestid from requests';

        const results = await this.db.query(query);

        await this.db.end();

        if (results.length > 0) {
            this.maxRequestId = results[0].max_requestid;
        }

        return this.maxRequestId;
    }
}