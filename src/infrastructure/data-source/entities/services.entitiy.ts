import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ServicesEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({unique: false})
    public name: string;

    @Column({unique: false})
    public duration: string;

    @Column({unique: false})
    public hourlyRate: number;

    @Column({unique: false})
    info1: string;

    @Column({unique: false})
    info2: string;

    @Column({unique: false})
    info3: string;
}