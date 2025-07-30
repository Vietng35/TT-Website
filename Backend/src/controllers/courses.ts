import { myDataSource } from "../app-data-source";
import { CourseEntity } from "../entities/course.entity";

export const courseRepo = myDataSource.getRepository(CourseEntity)

/**
 * 
 * @param lectureId Lecturer's ID
 * @returns Assigned courses of the lecturer
 */
export async function getCourses(lectureId?: number) {
    //find auto get all

    if (!lectureId || lectureId <= 0) {
        return courseRepo.find();
    }

    return courseRepo.find({
        relations: {
            userCourses: { user: true },
        },
        where:
        {
            userCourses: {
                user: {
                    id: lectureId
                }
            }
        }
    })
} 
