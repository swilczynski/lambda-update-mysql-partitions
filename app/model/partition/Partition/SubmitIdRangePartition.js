const Partition = require('../Partition');

module.exports = class SubmitIdRangePartition extends Partition {
    async isExpired() {
        const repo = this.di.get('InboxRepository');

        const minSubmitId = await repo.getMinSubmitId();

        if (this.partitionDescription < minSubmitId) {
            return true;
        }

        return false;
    }

    async isCurrent() {
        const repo = this.di.get('InboxRepository');

        const maxSubmitId = await repo.getMaxSubmitId();
        const maxNextSubmitId = maxSubmitId + 25000;

        const expression = (maxNextSubmitId - (maxNextSubmitId % 25000));

        if (this.partitionDescription == expression) {
            return true;
        }

        return false;
    }

    async isNext() {
        const repo = this.di.get('InboxRepository');

        const maxSubmitId = await repo.getMaxSubmitId();
        const maxNextSubmitId = maxSubmitId + 50000;

        const expression = (maxNextSubmitId - (maxNextSubmitId % 25000));

        if (this.partitionDescription == expression) {
            return true;
        }

        return false;
    }

    async getDefaultPartitionSpec(database, table) {
        const repo = this.di.get('InboxRepository');

        const maxSubmitId = await repo.getMaxSubmitId();
        const maxNextSubmitId = maxSubmitId + 25000;

        const name = 'p' + (maxSubmitId - (maxSubmitId % 25000));
        const expression = (maxNextSubmitId - (maxNextSubmitId % 25000));

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
        const expression = parseInt(this.partitionDescription) + 25000;

        return {
            'name': name,
            'type': type,
            'expression': expression
        };
    }
}