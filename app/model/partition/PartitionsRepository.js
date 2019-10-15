module.exports = class PartitionsRepository {
    constructor(db) {
        this.db = db;
    }

    async getAll(database, table) {
        const query = `select * from information_schema.partitions WHERE table_schema = '${database}' and table_name = '${table.name}' and partition_name is not null order by partition_ordinal_position asc`;

        const results = await this.db.query(query);

        await this.db.end();

        let partitions = [];

        results.forEach((element) => {
            partitions.push(element);
        });

        return partitions
    }

    async deletePartition(database, table, partition) {
        const query = `alter table ${table.name} drop partition ${partition.partitionName}`;

        await this.db.query(query);
        await this.db.end();
    }

    async createCurrentPartition(database, table, currentPartition) {
        const newPartitionSpec = await currentPartition.getDefaultPartitionSpec();

        const queryAddPartition = `alter table ${table.name} ${newPartitionSpec.method} partitions 1 (partition ${newPartitionSpec.name} ${newPartitionSpec.type} (${newPartitionSpec.expression}) engine = InnoDB)`;

        await this.db.query(queryAddPartition);
        await this.db.end();

        return newPartitionSpec;
    }

    async createNextPartition(database, table, lastPartition) {
        const newPartitionSpec = lastPartition.getNewPartitionSpec();
        const newPartitionSql = `partition ${newPartitionSpec.name} ${newPartitionSpec.type} (${newPartitionSpec.expression}) engine = InnoDB`;

        const query = `alter table ${table.name} add partition (${newPartitionSql})`;

        await this.db.query(query);
        await this.db.end();

        return newPartitionSpec;
    }
}