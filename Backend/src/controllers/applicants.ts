import { Like } from "typeorm";
import { myDataSource } from "../app-data-source";
import { ApplicantEntity } from "../entities/applicant.entity";
import { courseRepo } from "./courses";
import { userRepository } from "./users";
import { UserApplicantEntity } from "../entities/user-applicant.entity";
import { CourseEntity } from "../entities/course.entity";
import { UserEntity } from "../entities/user.entity";

const applicantRepository = myDataSource.getRepository(ApplicantEntity);
const userApplicantRepository = myDataSource.getRepository(UserApplicantEntity);

interface CreateApplicantPayload {
  courseId?: number;
  availability?: string;
  role?: string;
  credential?: string;
  experience?: string;
  skill?: string;
  tutorId?: number;
}

/**
 * 
 * @param applicantEntity An object of new applicant
 * @returns status and a message if an error occurs
 */
export async function createApplicant(applicantEntity: CreateApplicantPayload) {
  //validate
  // console.log(applicantEntity);
  if (
    !(
      applicantEntity.courseId &&
      applicantEntity.availability &&
      applicantEntity.role &&
      applicantEntity.credential &&
      applicantEntity.experience &&
      applicantEntity.skill &&
      applicantEntity.tutorId
    )
  )
    return {
      status: false,
      message: "Invalid Payload",
    };

  const tutor = await userRepository.findOne({
    where: {
      role: "Tutor",
      id: applicantEntity.tutorId,
    },
  });

  if (!tutor) {
    return {
      status: false,
      message: "Invalid Tutor",
    };
  }

  const course = await courseRepo.findOne({
    where: {
      id: applicantEntity.courseId,
    },
  });

  if (!course) {
    return {
      status: false,
      message: "Fail to find courseID",
    };
  }

  //Check A candidate SHOULD NOT BE ABLE TO APPLY FOR A SAME ROLE TWICE 
  const tutorId = applicantEntity.tutorId;

  const existingApps = await applicantRepository.find({
    where: {
      tutor: {
        id: tutorId
      },
      course: {
        id: applicantEntity.courseId
      }
    }
  })

  //Check one applicant apply more than two position for this course or not
  if (existingApps.length >= 2) {
    return {
      status: false,
      message: "You applied two positions for this course"
    }
  }

  // Check one applicant apply same position or not
  const hasSimilarRole = existingApps.some((r) => r.role === applicantEntity.role)
  if (hasSimilarRole) {
    return {
      status: false,
      message: "You applied the position for this course "
    }
  }

  const newApplicants = new ApplicantEntity();
  newApplicants.availability = applicantEntity.availability;
  newApplicants.role = applicantEntity.role;
  newApplicants.credential = applicantEntity.credential;
  newApplicants.skill = applicantEntity.skill;
  newApplicants.experience = applicantEntity.experience;
  newApplicants.course = course;
  newApplicants.tutor = tutor;

  try {
    await applicantRepository.save(newApplicants);
  } catch (error) {
    return {
      status: false,
      message: "Add is failed",
    };
  }

  return {
    status: true,
  };
}

const allowed_Availability = ["Full Time", "Part Time"];
const allowed_Role = ["Tutor", "Lab Assistant"];

export async function checkApplicant(
  availability: string,
  role: string,
  credential: string,
  experience: string,
  skill: string,
  course: number
) {
  //validate Availability
  if (!allowed_Availability.includes(availability))
    return {
      status: false,
      message: "Users do not choose any availability",
    };

  if (!allowed_Role.includes(role))
    return {
      status: false,
      message: "Users do not choose any Role",
    };

  //validate credential
  const credentiaAndExperiencePattern =
    /^(.+?)\s*-\s*(.+?)\s*-\s*(\d{4})\s*-\s*(\d{4}|Present|Now)$/;
  console.log(
    credential,
    experience,
    credential.match(credentiaAndExperiencePattern)
  );
  if (!credential.match(credentiaAndExperiencePattern))
    return {
      status: false,
      message: "Please adjust right form",
    };

  const ifMMatch = credential.match(credentiaAndExperiencePattern);
  if (ifMMatch) {
    const [, , , Startyear, Endyear] = ifMMatch;
    //EndYear < StartYear
    if (Endyear < Startyear)
      return {
        status: false,
        message: "End Year must be greater or equal to Start Year",
      };
  }

  //validate experience
  if (!experience.match(credentiaAndExperiencePattern))
    return {
      status: false,
      message: "Please adjust right form",
    };

  const ifMatchExperience = experience.match(credentiaAndExperiencePattern);
  if (ifMatchExperience) {
    const [, , , StartYear, EndYear] = ifMatchExperience;
    //EndYear < StartYear
    if (EndYear < StartYear)
      return {
        status: false,
        message: "End Year must be greater or equal to Start Year",
      };
  }

  const rs = await courseRepo.findOne({
    where: {
      id: course,
    },
  });

  if (!rs)
    return {
      status: false,
      message: "Course not found in the data base",
    };

  return { status: true, message: "Account Pass" };
}

interface GetApplicantsQuery {
  searchTerm?: string;
  searchOption?: "name" | "availability" | "skill" | "course" | "role";
  sortBy?: "courseName" | "availability" | "role";
  lecturerId?: string;
  isSelected?: string;
}

/**
 * 
 * @param searchTerm The keyword to search applicants
 * @param searchOption The option to search applicants
 * @param sortBy The option to sort applicants
 * @param lectureId Lecturer's ID to retrieve applicants to their assigned courses
 * @param isSelected A boolean value whether the applicant is selected by the lecturer
 * @returns Applicants applied to assigned courses by Lecturer's ID
 */
export async function getApplicants({
  searchTerm = "",
  searchOption = "name",
  sortBy,
  lecturerId,
  isSelected
}: GetApplicantsQuery) {
  const lectureIdNumber = parseInt(lecturerId)
  const isSelectedBoolean = isSelected === "true"
  const applicants = await applicantRepository.find({
    where: {
      course: {
        // Filter only courses of the lecturer gets assigned to
        userCourses: {
          user: {
            id: lectureIdNumber
          }
        },

        // Search by course id
        id:
          searchOption == "course" && searchTerm
            ? parseInt(searchTerm)
            : undefined,
      },

      // Search by availability, skill
      ...(searchOption !== "course" && searchOption !== "name" && {
        [searchOption]: Like(`%${searchTerm}%`),
      }),

      // Search by name
      ...(searchOption == "name" && searchTerm && {
        tutor: {
          name: searchTerm
        }
      }),
    },
    order: {
      ...(sortBy === "courseName"
        ? { course: { name: "ASC" }, userapplicants: { ranking: "DESC" } }
        :
        sortBy === "availability"
          ? { availability: "ASC" }
          :
          sortBy === "role"
            ? { role: "ASC" }
            :
            { userapplicants: { ranking: "DESC" } }),
    },
    relations: {
      userapplicants: { lecturer: true },
      course: true,
      tutor: true
    },
    select: {
      tutor: {
        isBlock: true,
        email: true,
        name: true,
      }
    }
  });

  const filteredApplicants = applicants.filter(
    (applicant) => {
      const isSelectedApplicant = applicant.userapplicants.some(
        (userApplicant) =>
          userApplicant.lecturer.id === (lectureIdNumber) && userApplicant.selected
      )
      if (isSelectedBoolean) return isSelectedApplicant
      return !isSelectedApplicant
    }
  )

  return filteredApplicants;
}

/**
 * 
 * @param lectureId Lecturer's ID
 * @param applicantId Applicant's ID
 * @param selected A boolean value whether the applicant is selected by the lecturer
 * @returns status and a message
 */
export async function selectApplicant(
  lectureId: number,
  applicantId: number,
  selected: boolean
) {
  const applicant = await userApplicantRepository.findOne({
    where: {
      applicant: { id: applicantId },
      lecturer: { id: lectureId },
    },
  });
  if (applicant) {
    await userApplicantRepository.update(applicant.id, { selected, ranking: 0 });
  } else {
    await userApplicantRepository.save({
      applicant: { id: applicantId },
      lecturer: { id: lectureId },
      selected,
      createdAt: new Date().toISOString(),
      ranking: 0,
      comment: "",
    });
  }
  return { status: true, message: "Success" };
}

/**
 * 
 * @param lecturerId Lecturer's ID
 * @param applicantId Applicant's ID
 * @param ranking Rank that Lecturer sets to the application
 * @returns A status and message to indicate whether the function is successful
 */
export async function setApplicantRanking(
  lecturerId: number,
  applicantId: number,
  ranking: number | null
) {
  const applicant = await userApplicantRepository.findOne({
    where: {
      applicant: { id: applicantId },
      lecturer: { id: lecturerId },
    },
  });
  if (applicant?.selected) {
    await userApplicantRepository.update(applicant.id, { ranking: ranking ?? null });
    return { status: true, message: "Success" };
  }
  return { status: false, message: "Applicant is not selected" };
}

/**
 * 
 * @param lecturerId Lecturer's ID
 * @param applicantId Applicant's ID
 * @param comment comment that Lecturer puts to the application
 * @returns A status and message to indicate whether the function is successful
 */

export async function updateComment(
  lecturerId: number,
  applicantId: number,
  comment: string
) {
  const userApplicant = await userApplicantRepository.findOne({
    where: {
      applicant: { id: applicantId },
      lecturer: { id: lecturerId },
    },
  });

  if (userApplicant)
    await userApplicantRepository.update(userApplicant.id, { comment });
  else
    await userApplicantRepository.save({
      applicant: { id: applicantId },
      lecturer: { id: lecturerId },
      comment,
      ranking: 0,
      selected: false,
    });
  return { status: true, message: "Success" };
}
interface getLeaderboardQuery {
  limit?: number
  countNumber?: number
}

/**
 * @param applicantId ID of the candidate
 * @return Applications candidate applied
 */
export async function getApplicationbyID(applicantId: number){
  const applications = applicantRepository.find({
    where: {tutor: {id: applicantId}},
    relations:{userapplicants: true, course: true, tutor: true}
  })

  return applications
}

/**
 * 
 * @param limit Total Number of candidates to retrieve
 * @param countNumber The minimum number of selection of an application.
 * @returns return an JSON object containing selectedApplicants array and notSelectedApplicants array
 */

export async function getLeaderboard({ limit, countNumber = 0}: getLeaderboardQuery) {
  if(limit > 0){
    const selectedApplicants = await userApplicantRepository.createQueryBuilder("user_applicant_entity")
    .select(["CONCAT(user_entity.name, ' (', user_entity.email, ')') AS candidateName",
      "COUNT(user_applicant_entity.applicantId) AS count",
      "GROUP_CONCAT(DISTINCT course_entity.name SEPARATOR ', ') as courseName"])
    .innerJoin(ApplicantEntity, "applicant_entity", "applicant_entity.Id = user_applicant_entity.applicantId")
    .innerJoin(CourseEntity, "course_entity", "course_entity.Id = applicant_entity.courseId")
    .innerJoin(UserEntity, "user_entity", "applicant_entity.tutorId = user_entity.Id")
    .where("user_applicant_entity.selected = 1 AND user_entity.isBlock = 0")
    .groupBy("user_entity.name, user_entity.email")
    .having(`count > ${countNumber}`)
    .orderBy("count", "DESC")
    .limit(limit)
    .getRawMany()

    const notSelectedApplicants = await userApplicantRepository.createQueryBuilder("user_applicant_entity")
    .select(["CONCAT(user_entity.name, ' (', user_entity.email, ')') AS candidateName", "GROUP_CONCAT(DISTINCT course_entity.name SEPARATOR ', ') as courseName"])
    .innerJoin(ApplicantEntity, "applicant_entity", "applicant_entity.Id = user_applicant_entity.applicantId")
    .innerJoin(CourseEntity, "course_entity", "course_entity.Id = applicant_entity.courseId")
    .innerJoin(UserEntity, "user_entity", "applicant_entity.tutorId = user_entity.Id")
    .where("user_entity.isBlock = 0")
    .andWhere((qb) => {
      const query = qb.subQuery().select().from(UserApplicantEntity, "a")
        .where("a.applicantId = user_applicant_entity.applicantId")
        .andWhere("a.selected = 1")
        .getQuery()

      return `NOT EXISTS(${ query })`;
    })
    .groupBy("user_entity.name, user_entity.email")
    .orderBy("candidateName", "ASC")
    .limit(limit)
    .getRawMany();


    return { selectedApplicants, notSelectedApplicants }
  }
  else{
    const selectedApplicants = await userApplicantRepository.createQueryBuilder("user_applicant_entity")
    .select(["CONCAT(user_entity.name, ' (', user_entity.email, ')') AS candidateName",
      "COUNT(user_applicant_entity.applicantId) AS count",
      "GROUP_CONCAT(DISTINCT course_entity.name SEPARATOR ', ') as courseName"])
    .innerJoin(ApplicantEntity, "applicant_entity", "applicant_entity.Id = user_applicant_entity.applicantId")
    .innerJoin(CourseEntity, "course_entity", "course_entity.Id = applicant_entity.courseId")
    .innerJoin(UserEntity, "user_entity", "applicant_entity.tutorId = user_entity.Id")
    .where("user_applicant_entity.selected = 1 AND user_entity.isBlock = 0")
    .groupBy("user_entity.name, user_entity.email")
    .having(`count > ${countNumber}`)
    .orderBy("count", "DESC")
    .getRawMany()

    const notSelectedApplicants = await userApplicantRepository.createQueryBuilder("user_applicant_entity")
    .select(["CONCAT(user_entity.name, ' (', user_entity.email, ')') AS candidateName", "GROUP_CONCAT(DISTINCT course_entity.name SEPARATOR ', ') as courseName"])
    .innerJoin(ApplicantEntity, "applicant_entity", "applicant_entity.Id = user_applicant_entity.applicantId")
    .innerJoin(CourseEntity, "course_entity", "course_entity.Id = applicant_entity.courseId")
    .innerJoin(UserEntity, "user_entity", "applicant_entity.tutorId = user_entity.Id")
    .where("user_entity.isBlock = 0")
    .andWhere((qb) => {
      const query = qb.subQuery().select().from(UserApplicantEntity, "a")
        .where("a.applicantId = user_applicant_entity.applicantId")
        .andWhere("a.selected = 1")
        .getQuery()

      return `NOT EXISTS(${ query })`;
    })
    .groupBy("user_entity.name, user_entity.email")
    .orderBy("candidateName", "ASC")
    .getRawMany();

    return { selectedApplicants, notSelectedApplicants }
  }
}
