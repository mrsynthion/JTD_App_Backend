import {MigrationInterface, QueryRunner, TableColumn} from "typeorm"

export class TaskColumnStatus1698242593137 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('task',
            new TableColumn({
                name: "completed",
                type: 'boolean',
                isNullable: false,
                default: false
            }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('task', 'status')
    }

}
