module.exports = class Partition {
    constructor(di) {
        this.di = di;
    }

    build(element, isPrunable) {
        this.partitionName = (element.PARTITION_NAME || '').trim();
        this.partitionMethod = (element.PARTITION_METHOD || '').trim();
        this.partitionExpression = (element.PARTITION_EXPRESSION || '').trim();
        this.partitionDescription = (element.PARTITION_DESCRIPTION || '').trim();
        this.tableSchema = (element.TABLE_SCHEMA || '').trim();
        this.tableName = (element.TABLE_NAME || '').trim();
        this.createTime = (element.CREATE_TIME || '');

        this.isPrunable = isPrunable;
    }
}