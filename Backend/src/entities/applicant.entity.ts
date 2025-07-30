import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CourseEntity } from "./course.entity";
import { UserEntity } from "./user.entity";
import { UserApplicantEntity } from "./user-applicant.entity";

@Entity()
export class ApplicantEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    credential: string

    @Column()
    availability: string

    @Column()
    role: string

    @Column()
    experience: string

    @Column()
    skill: string

    @ManyToOne(() => CourseEntity, (course) => course.applicants)
    course: CourseEntity

    @ManyToOne(() => UserEntity, (tutor) => tutor.applicants)
    tutor: UserEntity

    @OneToMany(() => UserApplicantEntity, (userapplicant) => userapplicant.applicant)
    userapplicants: UserApplicantEntity[]
}