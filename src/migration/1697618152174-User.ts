export class User1697618152174 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'user',
            new TableColumn({
                name: "username",
                type: 'varchar',
                length: '200',
                isNullable: false,
                isPrimary: false
            })
        )
        await queryRunner.query("update user set username = email");
        await queryRunner.query("alter table user add constraint uq1 unique (username)");

        await queryRunner.query("alter table user add constraint uq2 unique (email)");

        await queryRunner.addColumn(
            'user',
            new TableColumn({
                name: "password",
                type: 'varchar',
                length: '200',
                isNullable: false,
                isPrimary: false
            })
        )
    }


    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns(
            "user",
            ['username', 'password']
        )
    }
}

import {MigrationInterface, QueryRunner, TableColumn} from "typeorm"
