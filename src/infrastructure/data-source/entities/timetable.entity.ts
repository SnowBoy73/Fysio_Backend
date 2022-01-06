import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TimetableEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;
    
    @Column({unique: false})
    public day: string;

    @Column({unique: false})
    public startTime: string;

    @Column({unique: false})
    public breakStart: string;

    @Column({unique: false})
    public breakFinish: string;

    @Column({unique: false})
    public finishTime: string;

}

