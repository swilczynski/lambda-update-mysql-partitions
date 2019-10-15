const Partition = require('../Partition');

module.exports = class RequestIdRangePartition extends Partition {
    async isExpired() {
        const repo = this.di.get('RequestsRepository');

        const minRequestId = await repo.getMinRequestId();

        if (this.partitionDescription < minRequestId) {
            return true;
        }

        return false;
    }

    async isCurrent() {
        const repo = this.di.get('RequestsRepository');

        const maxRequestId = await repo.getMaxRequestId();
        const maxNextRequestId = maxRequestId + 1000000;

        const expression = (maxNextRequestId - (maxNextRequestId % 1000000));

        if (this.partitionDescription == expression) {
            return true;
        }

        return false;
    }

    async isNext() {
        const repo = this.di.get('RequestsRepository');

        const maxRequestId = await repo.getMaxRequestId();
        const maxNextRequestId = maxRequestId + 2000000;

        const expression = (maxNextRequestId - (maxNextRequestId % 1000000));

        if (this.partitionDescription == expression) {
            return true;
        }

        return false;
    }

    async getDefaultPartitionSpec(database, table) {
        const repo = this.di.get('RequestsRepository');

        const maxRequestId = await repo.getMaxRequestId();
        const maxNextRequestId = maxRequestId + 1000000;

        const name = 'p' + (maxRequestId - (maxRequestId % 1000000));
        const expression = (maxNextRequestId - (maxNextRequestId % 1000000));

        return {
            'name': name,
            'type': 'values less than',
            'method': 'partition by range (requestID)',
            'expression': expression,
        };
    }

    getNewPartitionSpec() {
        const name = `p${this.partitionDescription}`;
        const type = 'values less than';
        const expression = parseInt(this.partitionDescription) + 1000000;

        return {
            'name': name,
            'type': type,
            'expression': expression
        };
    }
}