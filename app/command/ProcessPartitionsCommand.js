const PartitionFactory = require('../model/partition/PartitionFactory');

module.exports = class ProcessPartitionsCommand {
    constructor(di) {
        this.di = di;
    }

    async execute(database) {
        for (let i = 0; i < database.tables.length; i++) {
            await this.processTable(database.name, database.tables[i]);
        }
    }

    async processTable(database, table) {
        const partitionsRepository = this.di.get('PartitionsRepository');

        const partitions = await partitionsRepository.getAll(database, table);

        let lastPartition = null;
        let hasCurrent = false;
        let hasNext = false;

        console.log(`Table ${table.name} is`, !table.prunable ? 'not' : '', 'prunable');

        for (let i = 0; i < partitions.length; i++) {
            const partition = new PartitionFactory(this.di).build(table, partitions[i]);

            if (partition.isPrunable && await partition.isExpired()) {
                console.log(`Deleting expired partition ${partition.partitionName} from table ${table.name}`);

                try {
                    await partitionsRepository.deletePartition(database, table, partition);
                }
                catch (error) {
                    console.error('Could not delete partition. Details: ', error.sqlMessage, error.sql);
                }
            }

            if (await partition.isCurrent()) {
                console.log(`Table ${table.name} has current partition. Current partition is ${partition.partitionName}`);

                hasCurrent = true;
            }

            if (await partition.isNext()) {
                console.log(`Table ${table.name} has next partition. Next partition is ${partition.partitionName}`);

                hasNext = true;
            }

            lastPartition = partition;
        }

        if (!hasCurrent) {
            console.log(`Table ${table.name} does not have partitions, adding default partition.`);

            await partitionsRepository.createCurrentPartition(database, table, new PartitionFactory(this.di).build(table, {}));

            const newPartitions = await partitionsRepository.getAll(database, table);

            if (newPartitions.length > 0) {
                lastPartition = new PartitionFactory(this.di).build(table, newPartitions[0]);
            }
        }

        if (lastPartition && !hasNext) {
            console.log(`Table ${table.name} does not have next partition, adding next partition.`);

            const newPartitionSpec = await partitionsRepository.createNextPartition(database, table, lastPartition)

            console.log(`Table ${table.name}, added next partition ${newPartitionSpec.name}`);
        }
    }
}