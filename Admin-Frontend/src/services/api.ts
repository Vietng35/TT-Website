import { gql } from "@apollo/client";
import client from "./apollo-client";

// TypeScript interfaces for data models
export interface Course {
    id: number;
    name: string;
    applicants: Applicant[];
    userCourses: UserCourse[];
}

export interface User {
    id: number;
    isBlock: boolean;
    name: String;
    email: string;
    role: string;
    token?: string;
    createdAt: string;
    userCourses: UserCourse[];
    applicants: Applicant[];
    userApplicants: UserApplicant[];
}

export interface Applicant {
    id: number;
    credential: string;
    availability: string;
    role: string;
    experience: string;
    skill: string;
    course: Course;
    tutor: User;
    userapplicants: UserApplicant[];
}

export interface UserCourse {
    id: number;
    course: Course;
    user: User;
}

export interface UserApplicant {
    id: number;
    createdAt: string;
    ranking: number;
    comment: string;
    selected: boolean;
    lecturer: User;
    applicant: Applicant;
}

// GraphQL query to get all courses (id and name only)

const GET_COURSES = gql`
  query GetCourses {
    courses {
      id
      name
    }
  }
`;

// GraphQL query to get all users (lecturers)
const GET_LECTURERS = gql`
  query GetLecturers {
    users {
      id
      email
      name
      role
      isBlock
    }
  }
`;
// Mutation: Assign a lecturer to a course
export const ASSIGN_LECTURER_TO_COURSE = gql`
  mutation AssignLecturerToCourse($lecturerId: Int!, $courseId: Int!) {
    assignLecturerToCourse(lecturerId: $lecturerId, courseId: $courseId) {
      user { id }
      course { id }
    }
  }
`;

// Mutation: Admin login
export const ADMIN_LOGIN = gql`
  mutation AdminLogin($email: String!, $password: String!) {
    adminLogin(email: $email, password: $password) {
      email
      token
    }
  }
`;

// Mutation: Edit course name
export const ADMIN_EDIT = gql`
    mutation AdminEdit($courseId: Int!, $courseName: String!) {
        editCourse(courseId: $courseId, courseName: $courseName) {
          id
          name
        }
    }
`;

// Query: Get all courses for course management table
export const COURSE_QUERY = gql`
  query CourseTableCourseManage{
    courses {
        id
        name
    }
  }
`;

// Mutation: Create a new course
export const ADMIN_CREATE = gql`
  mutation AdminCreate($courseName: String!) {
    createCourse(courseName: $courseName) {
      id
      name
    }
  }
`;


// Mutation: Delete a course by id
export const ADMIN_DELETE = gql`
  mutation AdminDelete($courseId: Int!) {
    deleteCourse(courseId: $courseId)
  }
`;


// Mutation: Block or unblock a user (toggle)
export const ADMIN_BLOCK = gql`
  mutation AdminBlock($userId: Int!) {
    blockOrUnblockLogin(userId: $userId)
  }
`;


// Query: Get candidates for a specific course
export const ADMIN_CANDIDATE_FOR_COURSE = gql`
  query AdminCandidateForCourse($courseId: Int!) {
    listCandidateForCourse(courseId: $courseId) {
      id
      name
      email
      applicants {
        role
      }
    }
  }
`;


// Query: Get candidates who have not been chosen
export const ADMIN_CANDIDATE_NO_CHOSEN = gql`
  query AdminCandidateNoChosen {
    listCandidateNoChosen {
      id
      name
      email
    }
  }
`;

// Query: Get candidates chosen for more than three courses
export const ADMIN_CANDIDATE_FOR_COURSE_THREE_COURSES = gql`
  query AdminCandidateForCourseThreeCourses {
    listCandidateChosenForMoreThreeCourses {
      id
      name
      email
    }
  }
`;

// Service functions for fetching courses and lecturers
export const courseService = {
    getAllCourses: async (): Promise<Course[]> => {
        const { data } = await client().query({ query: GET_COURSES });
        return data.courses;
    },
    getAllLecturers: async (): Promise<User[]> => {
        const { data } = await client().query({ query: GET_LECTURERS });
        return data.users;
    },
};