module.exports = class InboxRepository {
    constructor(db) {
        this.db = db;
    }

    async getMinSubmitId() {
        if (this.minSubmittId != null) {
            return this.minSubmittId;
        }

        this.minSubmittId = 0;

        const query = 'select min(submitID) as min_submitid from inbox';

        const results = await this.db.query(query);

        await this.db.end();

        if (results.length > 0) {
            this.minSubmittId = results[0].min_submitid;
        }

        return this.minSubmittId;
    }

    async getMaxSubmitId() {
        if (this.maxSubmittId != null) {
            return this.maxSubmittId;
        }

        this.maxSubmittId = 0;

        const query = 'select max(submitID) as max_submitid from inbox';

        const results = await this.db.query(query);

        await this.db.end();

        if (results.length > 0) {
            this.maxSubmittId = results[0].max_submitid;
        }

        return this.maxSubmittId;
    }
}