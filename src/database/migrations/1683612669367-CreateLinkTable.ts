import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLinkTable1683612669367 implements MigrationInterface {
    name = 'CreateLinkTable1683612669367'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "links" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "token" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_ecf17f4a741d3c5ba0b4c5ab4b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "links" ADD CONSTRAINT "FK_56668229b541edc1d0e291b4c3b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "FK_56668229b541edc1d0e291b4c3b"`);
        await queryRunner.query(`DROP TABLE "links"`);
    }

}
