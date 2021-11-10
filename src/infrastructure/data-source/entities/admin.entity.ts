import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AdminEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({ unique: true })
    public  username: string;

    @Column({ unique: true })
    public password: string;

}
