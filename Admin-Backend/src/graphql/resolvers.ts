import { UserCourseEntity } from "../entities/user-course.entity";
import { myDataSource } from "../app-data-source";
import { UserEntity } from "../entities/user.entity";
import { ApplicantEntity } from "../entities/applicant.entity";
import { CourseEntity } from "../entities/course.entity";
import { UserApplicantEntity } from "../entities/user-applicant.entity";
import { In } from "typeorm";
import { AdminEntity } from "../entities/admin.entity";
import { createHash, randomBytes } from "crypto";
import { PubSub } from "graphql-subscriptions";

// Import necessary entities and data source

const userRepository = myDataSource.getRepository(UserEntity);
const userCourseRepository = myDataSource.getRepository(UserCourseEntity);
const applicantRepository = myDataSource.getRepository(ApplicantEntity);
const courseRespository = myDataSource.getRepository(CourseEntity);
const userApplicantRepository = myDataSource.getRepository(UserApplicantEntity);
const adminRepository = myDataSource.getRepository(AdminEntity);
const pubsub = new PubSub();

// GraphQL resolvers for the Admin Backend
// These resolvers handle queries, mutations, and subscriptions related to users, courses, applicants, and admin actions.
export const resolvers = {
  Query: {
    users: async () => {
      return await userRepository.find();
    },
    courses: async () => {
      return await courseRespository.find();
    },
    applicants: async () => {
      return await applicantRepository.find();
    },

      
    listCandidateForCourse: async (_: any, { courseId }: { courseId: number }) => {
      const users = await userRepository.find({
        where:
        {
          applicants: {
            course: {
              id: courseId
            },
            userapplicants: {
              selected: true
            }
          }
        },
        relations: {
          applicants: true
        },
        select: {
          applicants: true
        }
      });

      return users
    },
    listCandidateNoChosen: async () => {
      const result = await myDataSource
        .createQueryBuilder()
        .select("t1.id, SUM(t1.se)", "total_se")
        .from(subQuery => {
          return subQuery
            .select("us.id", "id")
            .addSelect("ap.courseId", "courseId")
            .addSelect("LEAST(SUM(COALESCE(usa.selected, 0)), 1)", "se")
            .from(UserEntity, "us")
            .innerJoin(ApplicantEntity, "ap", "us.id = ap.tutorId")
            .leftJoin(UserApplicantEntity, "usa", "usa.applicantId = ap.id")
            .groupBy("us.id, ap.courseId");
        }, "t1")
        .groupBy("t1.id")
        .having("total_se = 0")
        .getRawMany();

      const users = await userRepository.findBy({
        id: In(result.map(r => r.id))
      })

      return users;
    },
    listCandidateChosenForMoreThreeCourses: async () => {
      const result = await myDataSource
        .createQueryBuilder()
        .select("t1.id, SUM(t1.se)", "total_se")
        .from(subQuery => {
          return subQuery
            .select("us.id", "id")
            .addSelect("ap.courseId", "courseId")
            .addSelect("LEAST(SUM(COALESCE(usa.selected, 0)), 1)", "se")
            .from(UserEntity, "us")
            .innerJoin(ApplicantEntity, "ap", "us.id = ap.tutorId")
            .leftJoin(UserApplicantEntity, "usa", "usa.applicantId = ap.id")
            .groupBy("us.id, ap.courseId");
        }, "t1")
        .groupBy("t1.id")
        .having("total_se > 3")
        .getRawMany();
      const users = await userRepository.findBy({
        id: In(result.map(r => r.id))
      })

      return users;
    },
  },
  Mutation: {
    adminLogin: async (_: any, { email, password }: { email: string, password: string }) => {
      const hashPasswordInput = createHash("sha256").update(password).digest('hex');
      const admin = await adminRepository.findOne({
        where: { email, password: hashPasswordInput }
      });

      if (!admin) {
        throw new Error("Invalid email or password!");
      }

      const token = createHash("sha256").update(Date.now() + email).digest('hex');
      admin.token = token;
      await adminRepository.save(admin);

      return {
        id: admin.id,
        email: admin.email,
        token: admin.token,
      };
    },


    adminLogout: async (_: any, { token }: { token: string }) => {
      const admin = await adminRepository.findOne({
        where: { token }
      });

      if (!admin) {
        throw new Error("Invalid token!");
      }

      admin.token = "";
      await adminRepository.save(admin);

      return true;
    },



    assignLecturerToCourse: async (_: any, { lecturerId, courseId }: { lecturerId: number, courseId: number }) => {
      const lecture = await userRepository.findOne({
        where: {
          id: lecturerId
        }
      });

      const course = await courseRespository.findOne({
        where: {
          id: courseId
        }
      });

      if (!lecture || !course) {
        throw new Error("Lecture or Course not found!");
      }

      const assignmentFound = await userCourseRepository.findOne({
        where: {
          course: {
            id: courseId
          },
          user: {
            id: lecturerId
          }
        }
      });

      if (assignmentFound) {
        throw new Error("This lecture has been assigned to this course before!");
      }

      const newAssignment = userCourseRepository.create({ course, user: lecture });

      return await userCourseRepository.save(newAssignment);
    },

    createCourse: async (_: any, { courseName }: { courseName: string }) => {
      const foundCourse = await courseRespository.findOne({
        where: {
          name: courseName
        }
      });

      if (foundCourse) {
        throw new Error("Course is existed in the system!");
      }

        if (courseName.substring(0, 4) !== "COSC") {
            throw new Error("The course code must start with 'COSC'!");
        }
        for(let i:number=4; i<=7; i++) {
            if(!Number.isInteger(Number.parseInt(courseName[i]))) {
                throw new Error("The course code must follow the format COSCxxxx, where xxxx stands for any number between 0 and 9!");
            }
        }

      const newCourseName = "COSC" + courseName.split("COSC")[1].split(" ").map((word: string) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }).join(" ");

      const newCourse = courseRespository.create({ name: newCourseName });
      return await courseRespository.save(newCourse);
    },

    deleteCourse: async (_: any, { courseId }: { courseId: number }) => {
      const result = await courseRespository.delete(courseId);
      return result.affected !== 0;
    },

    editCourse: async (_: any, { courseId, courseName }: { courseId: number, courseName: string }) => {
      const rs = await courseRespository.findOne({
        where:
        {
          name: courseName
        }
      })

      if (rs) {
        throw new Error("Name is existed in the system!")
      }

      await courseRespository.update(courseId, { name: courseName });

      return await courseRespository.findOne({
        where:
        {
          id: courseId,
          name: courseName
        }
      })
    },

    blockOrUnblockLogin: async (_: any, { userId }: { userId: number }) => {
      const user = await userRepository.findOne({
        where:
        {
          id: userId
        }
      })

      if (!user) {
        throw new Error("User not existed!")
      }

      const newBlock = !user.isBlock

      await userRepository.update(userId, { isBlock: newBlock });

      const afterUser = await userRepository.findOne({
        where: {
          id: userId
        }
      });

      pubsub.publish("BLOCK_STATUS_UPDATED", {
        blockStatusUpdated: afterUser
      })

      return newBlock
    }

  },

  Subscription: {
    blockStatusUpdated: {
      subscribe: () => pubsub.asyncIterableIterator(['BLOCK_STATUS_UPDATED'])
    }
  }
};
