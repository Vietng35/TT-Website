import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn } from "typeorm"
import { UserCourseEntity } from "./user-course.entity"
import { ApplicantEntity } from "./applicant.entity"
import { UserApplicantEntity } from "./user-applicant.entity"

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    hashPassword: string

    @Column()
    name: string

    //unique banned same email.
    @Column({ unique: true })
    email: string

    @Column()
    isBlock: boolean

    @Column()
    role: string

    //nullable -> random some integer
    @Column({ nullable: true })
    token: string

    @CreateDateColumn()
    createdAt: Date

    @OneToMany(() => UserCourseEntity, (userCourse) => userCourse.user)
    userCourses: UserCourseEntity[]

    @OneToMany(() => ApplicantEntity, (applicant) => applicant.tutor)
    applicants: ApplicantEntity[]

    @OneToMany(() => UserApplicantEntity, (userApplicant) => userApplicant.lecturer)
    userApplicants: UserApplicantEntity[]

}
