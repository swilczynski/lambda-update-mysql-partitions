const moment = require('moment/moment');

const Partition = require('../Partition');

module.exports = class DaysListPartition extends Partition {
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
        const dayZero = moment([0, 0, 1]);

        const diff = Math.abs(dayZero.diff(today) / 1000);
        const numDays = Math.round(diff / 60 / 60 / 24);

        return {
            'name': today.format('pYYYYMMDD'),
            'type': 'values in',
            'method': 'partition by list (to_days(timestamp))',
            'expression': numDays,
        };
    }

    getNewPartitionSpec() {
        const tomorrow = moment().startOf('day').add(1, 'day');

        const dayZero = moment([0, 0, 1]);

        const diff = Math.abs(dayZero.diff(tomorrow) / 1000);
        const numDays = Math.round(diff / 60 / 60 / 24);

        const name = tomorrow.format('pYYYYMMDD');
        const type = 'values in';
        const expression = numDays;

        return {
            'name': name,
            'type': type,
            'expression': expression
        };
    }
}