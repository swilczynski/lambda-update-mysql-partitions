const moment = require('moment/moment');

const Partition = require('../Partition');

module.exports = class TimestampMonthRangePartition extends Partition {
    async isCurrent() {
        const today = moment().startOf('month').startOf('day');
        const partitionDate = moment(this.partitionName, "pYYYYMM").startOf('day');

        if (today.isSame(partitionDate)) {
            return true;
        }

        return false;
    }

    async isNext() {
        const today = moment().startOf('month').startOf('day');
        const partitionDate = moment(this.partitionName, "pYYYYMM").startOf('day');

        if (today.isBefore(partitionDate)) {
            return true;
        }

        return false;
    }

    async isExpired() {
        const lookback = moment().startOf('day').subtract(6, 'months');
        const partitionDate = moment(this.partitionName, "pYYYYMM").startOf('day');

        if (lookback.isAfter(partitionDate)) {
            return true;
        }

        return false;
    }

    async getDefaultPartitionSpec(database, table) {
        const today = moment().startOf('month');

        return {
            'name': today.format('pYYYYMM'),
            'type': 'values less than',
            'method': 'partition by range (timestamp)',
            'expression': today.add(1, 'month').unix(),
        };
    }

    getNewPartitionSpec() {
        const nextMonth = moment().startOf('month').add(1, 'month');
        const monthAfterNextMonth = moment().startOf('month').add(2, 'month');
        const interval = 86400;

        const name = nextMonth.format('pYYYYMM');
        const type = 'values less than';
        const expression = monthAfterNextMonth.unix();

        return {
            'name': name,
            'type': type,
            'expression': expression
        };
    }
}