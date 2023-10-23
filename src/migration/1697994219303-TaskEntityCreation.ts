import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm"

export class TaskEntityCreation1697994219303 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'task',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        length: '36',
                        isPrimary: true
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                        length: '200',
                    },
                    {
                        name: 'description',
                        type: 'longtext',
                    },
                    {
                        name: 'importanceLevel',
                        type: 'text',
                    },
                    {
                        name: 'createdAt',
                        type: 'datetime',
                    },
                    {
                        name: 'expirationDate',
                        type: 'datetime',
                    },
                    {
                        name: 'userId',
                        type: 'varchar',
                        length: '36',
                    }
                ]
            })
        );


        await queryRunner.createForeignKey(
            "task",
            new TableForeignKey({
                name: "user",
                columnNames: ["userId"],
                referencedColumnNames: ["id"],
                referencedTableName: "user",
                onDelete: "CASCADE",
            }),
        )

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('task');
    }
}
