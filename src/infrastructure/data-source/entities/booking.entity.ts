import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BookingEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({ unique: false })
    public date: string;
    
    @Column({ unique: false })
    public time: string;
    
    @Column({ unique: false })
    public service: string;

    @Column({ unique: false })
    public email: string;

    @Column({ unique: false })
    public phone: number;

    @Column({ unique: false })
    public address: string;

    @Column({ unique: false })
    public city: string;

    @Column({ unique: false })
    public postcode: number;

    @Column({ unique: false })
    public notes: string;

    @Column({ unique: false })
    public duration: number;
}
