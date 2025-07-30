import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApplicantEntity } from "./applicant.entity";
import { UserCourseEntity } from "./user-course.entity";

@Entity()
    export class CourseEntity {
        @PrimaryGeneratedColumn()
        id!:number

        @Column()
        name!:string

        @OneToMany(() => ApplicantEntity,(applicant)=>applicant.course)
        applicants!:ApplicantEntity[]

        @OneToMany(() => UserCourseEntity, (userCourse)=>userCourse.course)
        userCourses!:UserCourseEntity[]
    }