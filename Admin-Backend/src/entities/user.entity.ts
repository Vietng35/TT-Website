import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn } from "typeorm"
import { UserCourseEntity } from "./user-course.entity"
import { ApplicantEntity } from "./applicant.entity"
import { UserApplicantEntity } from "./user-applicant.entity"

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  isBlock: boolean

  @Column()
  hashPassword: string

  //unique banned same email.
  @Column({ unique: true })
  email: string

  @Column()
  role: string

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
