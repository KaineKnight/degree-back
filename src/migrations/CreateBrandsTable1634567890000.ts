import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBrandTable1634567890000 implements MigrationInterface {
  name = 'CreateBrandTable1634567890000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE brands (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        title character varying NOT NULL UNIQUE,
        weight integer DEFAULT 0,
        created_at timestamp without time zone NOT NULL DEFAULT NOW(),
        updated_at timestamp without time zone NOT NULL DEFAULT NOW(),
        deleted_at timestamp without time zone
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE brands;`);
  }
}
