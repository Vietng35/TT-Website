import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AdminEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

     @Column({ nullable: true })
    token: string; 
}
