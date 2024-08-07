import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTables1723025964195 implements MigrationInterface {
  name = "RenameTables1723025964195";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe"`,
    );

    await queryRunner.renameTable("user", "users");
    await queryRunner.renameTable("refresh_token", "refreshTokens");

    await queryRunner.query(
      `ALTER TABLE "refreshTokens" ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refreshTokens" DROP CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe"`,
    );

    await queryRunner.renameTable("users", "user");
    await queryRunner.renameTable("refreshTokens", "refresh_token");
  }
}
