const TimestampDayRangePartition = require('./Partition/TimestampDayRangePartition');
const TimestampMonthRangePartition = require('./Partition/TimestampMonthRangePartition');
const RequestIdRangePartition = require('./Partition/RequestIdRangePartition');
const SubmitIdRangePartition = require('./Partition/SubmitIdRangePartition');
const DaysListPartition = require('./Partition/DaysListPartition');

module.exports = class PartitionFactory {
    constructor(di) {
        this.di = di;
    }

    build(table, element) {
        const classMap = {
            TimestampDayRangePartition: TimestampDayRangePartition,
            TimestampMonthRangePartition: TimestampMonthRangePartition,
            RequestIdRangePartition: RequestIdRangePartition,
            SubmitIdRangePartition: SubmitIdRangePartition,
            DaysListPartition: DaysListPartition,
        };

        if (!classMap.hasOwnProperty(table.type)) {
            throw `There is no Partition class for ${table.type}`;
        }

        const partition = new classMap[table.type](this.di);

        partition.build(element, table.prunable);

        return partition;
    }
}