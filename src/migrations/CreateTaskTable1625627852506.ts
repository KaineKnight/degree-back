import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTaskTable1625627852506 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tasks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'contactName',
            type: 'varchar',
          },
          {
            name: 'contactPhone',
            type: 'varchar',
          },
          {
            name: 'contactEmail',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'isCompleted',
            type: 'boolean',
            default: false,
          },
          {
            name: 'statusId',
            type: 'uuid',
            default: 'f0986a2e-2cb0-4b31-b43f-10ddd6248d65',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'tasks',
      new TableForeignKey({
        columnNames: ['statusId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'statuses',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('tasks');
    const foreignKeyStatusId = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('statusId') !== -1,
    );

    await queryRunner.dropForeignKey('tasks', foreignKeyStatusId);
    await queryRunner.dropTable('tasks');
  }
}
