import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AdminEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({ unique: true })
    public  username: string;

    @Column({ unique: false })
    public password: string;

    @Column({ unique: false })
    public bookingSlotDuration: number;

}
