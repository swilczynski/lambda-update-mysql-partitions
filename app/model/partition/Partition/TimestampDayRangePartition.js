const moment = require('moment/moment');

const Partition = require('../Partition');

module.exports = class TimestampDayRangePartition extends Partition {
    async isCurrent() {
        const today = moment().startOf('day');
        const partitionDate = moment(this.partitionName, "pYYYYMMDD").startOf('day');

        if (today.isSame(partitionDate)) {
            return true;
        }

        return false;
    }

    async isNext() {
        const today = moment().startOf('day');
        const partitionDate = moment(this.partitionName, "pYYYYMMDD").startOf('day');

        if (today.isBefore(partitionDate)) {
            return true;
        }

        return false;
    }

    async isExpired() {
        const lookback = moment().startOf('day').subtract(6, 'months');
        const partitionDate = moment(this.partitionName, "pYYYYMMDD").startOf('day');

        if (lookback.isAfter(partitionDate)) {
            return true;
        }

        return false;
    }

    async getDefaultPartitionSpec(database, table) {
        const today = moment().startOf('day');

        return {
            'name': today.format('pYYYYMMDD'),
            'type': 'values less than',
            'method': 'partition by range (timestamp)',
            'expression': today.add(1, 'day').unix(),
        };
    }

    getNewPartitionSpec() {
        const tomorrow = moment().startOf('day').add(1, 'day');
        const dayAfterTomorrow = moment().startOf('day').add(2, 'day');

        const name = tomorrow.format('pYYYYMMDD');
        const type = 'values less than';
        const expression = dayAfterTomorrow.unix();

        return {
            'name': name,
            'type': type,
            'expression': expression
        };
    }
}