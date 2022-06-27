import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Teacher {
    @PrimaryColumn()
    userId: string;

    @Column()
    password: string;
}