import { DataSource } from "typeorm"
import { UserEntity } from "./entities/user.entity"
import { ApplicantEntity } from "./entities/applicant.entity"
import { CourseEntity } from "./entities/course.entity"
import { UserCourseEntity } from "./entities/user-course.entity"
import { UserApplicantEntity } from "./entities/user-applicant.entity"
import { AdminEntity } from "./entities/admin.entity"

export const myDataSource = new DataSource({
    type: "mysql",
    host: "209.38.26.237",
    port: 3306,
    username: "S4097536",
    password: "cunCode2006?",
    database: "S4097536",
    entities: [UserEntity, ApplicantEntity, CourseEntity, UserCourseEntity, UserApplicantEntity, AdminEntity],
    logging: true,
    synchronize: true,
    migrations: [],
    subscribers: [],
})