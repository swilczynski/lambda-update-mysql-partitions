const config = {
    databases: [
        {
            name: '<dbname>',
            credentials: {
                host: '<dbhost>',
                user: '<dbuser>',
                password: '<dbpassword>',
                database: '<dbname>',
            },
            tables: [
                {
                    name: 'test_table_01',
                    type: 'TimestampDayRangePartition', // PARTITION BY RANGE ( timestamp) PARTITION p20190821 VALUES LESS THAN (1566450000)
                    prunable: true,
                },
                {
                    name: 'test_table_02',
                    type: 'TimestampDayRangePartition', // PARTITION BY RANGE ( timestamp) PARTITION p20190821 VALUES LESS THAN (1566450000)
                    prunable: false, // NOT PRUNABLE, OLD PARTITIONS ARE NOT DELETED
                },
                {
                    name: 'test_table_03',
                    type: 'TimestampMonthRangePartition', // PARTITION BY RANGE (timestamp) PARTITION p201810 VALUES LESS THAN (1541044800)
                    prunable: true,
                },
                {
                    name: 'test_table_04',
                    type: 'DaysListPartition', // PARTITION BY LIST ( to_days(timestamp)) PARTITION p20190101 VALUES IN (737425)
                    prunable: true,
                },
                {
                    name: 'test_table_05',
                    type: 'RequestIdRangePartition', // PARTITION BY RANGE ( requestID) PARTITION p324000000 VALUES LESS THAN (325000000)
                    prunable: true,
                }
            ],
        }
    ],
};

module.exports = config;