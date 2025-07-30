import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CourseEntity } from "./course.entity";
import { UserEntity } from "./user.entity";

@Entity()
export class UserCourseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => CourseEntity, (course) => course.userCourses)
    course!: CourseEntity

    @ManyToOne(() => UserEntity, (user) => user.userCourses)
    user!: UserEntity
}