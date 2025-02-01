import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialsTable1738367441015 implements MigrationInterface {
  name = 'CreateInitialsTable1738367441015';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."comment_vote_vote_type_enum" AS ENUM('up', 'down')`,
    );
    await queryRunner.query(
      `CREATE TABLE "comment_vote" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "author_id" integer NOT NULL, "comment_id" integer NOT NULL, "vote_type" "public"."comment_vote_vote_type_enum" NOT NULL, CONSTRAINT "PK_4b5d08afceeb89bd5da77cfd71f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "comment" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "discussion_id" integer NOT NULL, "parent_comment_id" integer, "comment_count" integer NOT NULL, "author_id" integer NOT NULL, "content" character varying NOT NULL, "upvotes" integer NOT NULL, "downvotes" integer NOT NULL, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."discussion_vote_vote_type_enum" AS ENUM('up', 'down')`,
    );
    await queryRunner.query(
      `CREATE TABLE "discussion_vote" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "author_id" integer NOT NULL, "discussion_id" integer NOT NULL, "vote_type" "public"."discussion_vote_vote_type_enum" NOT NULL, CONSTRAINT "PK_aa7989dfd116e91d19a9e9ee6bd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_status_enum" AS ENUM('active', 'inactive')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_user_type_enum" AS ENUM('student', 'veterinarian')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "name" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "status" "public"."user_status_enum" NOT NULL DEFAULT 'active', "phone_number" character varying, "birth_date" TIMESTAMP NOT NULL, "user_type" "public"."user_user_type_enum" NOT NULL, "institution" character varying NOT NULL, "graduation_date" TIMESTAMP NOT NULL, "professional_registration" character varying, "country" character varying NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "discussion" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "author_id" integer NOT NULL, "comment_count" integer NOT NULL, "upvotes" integer NOT NULL, "downvotes" integer NOT NULL, "vote_grade" integer NOT NULL, "resolution" character varying, CONSTRAINT "PK_b93169eb129e530c6a4c3b9fda1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_vote" ADD CONSTRAINT "FK_a23aeafd2bb5c40a30836b852d9" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_vote" ADD CONSTRAINT "FK_4118e9566b4eeb589c599256c39" FOREIGN KEY ("comment_id") REFERENCES "comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_e8b51606e609942c2b21de04f82" FOREIGN KEY ("discussion_id") REFERENCES "discussion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_ac69bddf8202b7c0752d9dc8f32" FOREIGN KEY ("parent_comment_id") REFERENCES "comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_3ce66469b26697baa097f8da923" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "discussion_vote" ADD CONSTRAINT "FK_5aef5e20c622e7ab82eed92b92f" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "discussion_vote" ADD CONSTRAINT "FK_ebe5d6197786ed6bfedd42693a6" FOREIGN KEY ("discussion_id") REFERENCES "discussion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "discussion" ADD CONSTRAINT "FK_ece98699d7f7ab191a54202b6cb" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "discussion" DROP CONSTRAINT "FK_ece98699d7f7ab191a54202b6cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "discussion_vote" DROP CONSTRAINT "FK_ebe5d6197786ed6bfedd42693a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "discussion_vote" DROP CONSTRAINT "FK_5aef5e20c622e7ab82eed92b92f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_3ce66469b26697baa097f8da923"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_ac69bddf8202b7c0752d9dc8f32"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_e8b51606e609942c2b21de04f82"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_vote" DROP CONSTRAINT "FK_4118e9566b4eeb589c599256c39"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_vote" DROP CONSTRAINT "FK_a23aeafd2bb5c40a30836b852d9"`,
    );
    await queryRunner.query(`DROP TABLE "discussion"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_user_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
    await queryRunner.query(`DROP TABLE "discussion_vote"`);
    await queryRunner.query(
      `DROP TYPE "public"."discussion_vote_vote_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "comment"`);
    await queryRunner.query(`DROP TABLE "comment_vote"`);
    await queryRunner.query(`DROP TYPE "public"."comment_vote_vote_type_enum"`);
  }
}
