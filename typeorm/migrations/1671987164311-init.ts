import { MigrationInterface, QueryRunner } from "typeorm";

export class init1671987164311 implements MigrationInterface {
    name = 'init1671987164311'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "role" ("name" character varying NOT NULL, CONSTRAINT "PK_ae4578dcaed5adff96595e61660" PRIMARY KEY ("name"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "isEmailConfirmed" boolean NOT NULL DEFAULT false, "password" character varying NOT NULL, "galleryId" integer NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_e9044b9daccaca66208b108fc1" UNIQUE ("galleryId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "file_blocked_user_list" ("id" SERIAL NOT NULL, CONSTRAINT "PK_c786f00ebd6a03d03aba4beff9b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "media_file" ("id" SERIAL NOT NULL, "publicFileName" character varying NOT NULL, "localFileName" character varying NOT NULL, "extension" character varying NOT NULL, "path" character varying NOT NULL, "destination" character varying NOT NULL, "type" character varying NOT NULL, "galleryId" integer, "blockedUserListId" integer, CONSTRAINT "REL_7b0140b9f513c1d3b3dbc4839c" UNIQUE ("blockedUserListId"), CONSTRAINT "PK_cac82b29eea888470cc40043b76" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "gallery_blocked_user_list" ("id" SERIAL NOT NULL, CONSTRAINT "PK_c5687bd2e290a6d6e3b37c75cfd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "gallery" ("id" SERIAL NOT NULL, "isPrivate" boolean NOT NULL DEFAULT false, "blockedUserListId" integer, CONSTRAINT "REL_33c05cb28ba42c39114953ece3" UNIQUE ("blockedUserListId"), CONSTRAINT "PK_65d7a1ef91ddafb3e7071b188a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_roles_role" ("userId" integer NOT NULL, "roleName" character varying NOT NULL, CONSTRAINT "PK_8e8a23b3ea43dd063b8726385cd" PRIMARY KEY ("userId", "roleName"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5f9286e6c25594c6b88c108db7" ON "user_roles_role" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_02914c59615da1ef38e848e324" ON "user_roles_role" ("roleName") `);
        await queryRunner.query(`CREATE TABLE "file_blocked_user_list_blocked_users_user" ("fileBlockedUserListId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_73a2cc42bbbf7be5d7c1e155446" PRIMARY KEY ("fileBlockedUserListId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_371c4b0bf9da92664531ba2bfa" ON "file_blocked_user_list_blocked_users_user" ("fileBlockedUserListId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2304376612b5d07743e1c84b27" ON "file_blocked_user_list_blocked_users_user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "gallery_blocked_user_list_blocked_users_user" ("galleryBlockedUserListId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_b7115e50413b3df6a073524aab6" PRIMARY KEY ("galleryBlockedUserListId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_33021b2978e1c845449ab5914f" ON "gallery_blocked_user_list_blocked_users_user" ("galleryBlockedUserListId") `);
        await queryRunner.query(`CREATE INDEX "IDX_323f0916bba92df3af44d86e2c" ON "gallery_blocked_user_list_blocked_users_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_e9044b9daccaca66208b108fc19" FOREIGN KEY ("galleryId") REFERENCES "gallery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD CONSTRAINT "FK_1d3b514113edf5732b4125e4ae0" FOREIGN KEY ("galleryId") REFERENCES "gallery"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "media_file" ADD CONSTRAINT "FK_7b0140b9f513c1d3b3dbc4839c2" FOREIGN KEY ("blockedUserListId") REFERENCES "file_blocked_user_list"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gallery" ADD CONSTRAINT "FK_33c05cb28ba42c39114953ece35" FOREIGN KEY ("blockedUserListId") REFERENCES "gallery_blocked_user_list"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_5f9286e6c25594c6b88c108db77" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_02914c59615da1ef38e848e324a" FOREIGN KEY ("roleName") REFERENCES "role"("name") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "file_blocked_user_list_blocked_users_user" ADD CONSTRAINT "FK_371c4b0bf9da92664531ba2bfa8" FOREIGN KEY ("fileBlockedUserListId") REFERENCES "file_blocked_user_list"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "file_blocked_user_list_blocked_users_user" ADD CONSTRAINT "FK_2304376612b5d07743e1c84b27e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "gallery_blocked_user_list_blocked_users_user" ADD CONSTRAINT "FK_33021b2978e1c845449ab5914f0" FOREIGN KEY ("galleryBlockedUserListId") REFERENCES "gallery_blocked_user_list"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "gallery_blocked_user_list_blocked_users_user" ADD CONSTRAINT "FK_323f0916bba92df3af44d86e2c8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gallery_blocked_user_list_blocked_users_user" DROP CONSTRAINT "FK_323f0916bba92df3af44d86e2c8"`);
        await queryRunner.query(`ALTER TABLE "gallery_blocked_user_list_blocked_users_user" DROP CONSTRAINT "FK_33021b2978e1c845449ab5914f0"`);
        await queryRunner.query(`ALTER TABLE "file_blocked_user_list_blocked_users_user" DROP CONSTRAINT "FK_2304376612b5d07743e1c84b27e"`);
        await queryRunner.query(`ALTER TABLE "file_blocked_user_list_blocked_users_user" DROP CONSTRAINT "FK_371c4b0bf9da92664531ba2bfa8"`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_02914c59615da1ef38e848e324a"`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_5f9286e6c25594c6b88c108db77"`);
        await queryRunner.query(`ALTER TABLE "gallery" DROP CONSTRAINT "FK_33c05cb28ba42c39114953ece35"`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP CONSTRAINT "FK_7b0140b9f513c1d3b3dbc4839c2"`);
        await queryRunner.query(`ALTER TABLE "media_file" DROP CONSTRAINT "FK_1d3b514113edf5732b4125e4ae0"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_e9044b9daccaca66208b108fc19"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_323f0916bba92df3af44d86e2c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_33021b2978e1c845449ab5914f"`);
        await queryRunner.query(`DROP TABLE "gallery_blocked_user_list_blocked_users_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2304376612b5d07743e1c84b27"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_371c4b0bf9da92664531ba2bfa"`);
        await queryRunner.query(`DROP TABLE "file_blocked_user_list_blocked_users_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_02914c59615da1ef38e848e324"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5f9286e6c25594c6b88c108db7"`);
        await queryRunner.query(`DROP TABLE "user_roles_role"`);
        await queryRunner.query(`DROP TABLE "gallery"`);
        await queryRunner.query(`DROP TABLE "gallery_blocked_user_list"`);
        await queryRunner.query(`DROP TABLE "media_file"`);
        await queryRunner.query(`DROP TABLE "file_blocked_user_list"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
    }

}
