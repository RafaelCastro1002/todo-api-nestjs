import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "src/users/user.entity";
import { Role } from "src/role/role.enum";

export class SeedUserRecord1623071083569 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const userRepo = queryRunner.manager.getRepository(User);

        const user = userRepo.create({
            password: 'admin',
            email: 'admin@admin.com',
            role: Role.Admin
        });

        await userRepo.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
