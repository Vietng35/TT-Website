import gql from "graphql-tag";
export const typeDefs = gql`

type Course {
  id: Int!
  name: String!
  applicants: [Applicant!]!
  userCourses: [UserCourse!]!
}


type Admin {
  id: Int!
  email: String!
  password: String!
  token: String!
}


type User {
  id: Int!
  name: String!
  isBlock: Boolean!
  email: String!
  role: String!
  token: String
  createdAt: String!
  userCourses: [UserCourse!]!
  applicants: [Applicant!]!
  userApplicants: [UserApplicant!]!
}


type Applicant {
  id: Int!
  credential: String!
  availability: String!
  role: String!
  experience: String!
  skill: String!
  course: Course!           
  tutor: User!             
  userapplicants: [UserApplicant!]!
}


type UserCourse {
  id: Int!
  course: Course!
  user: User!
}


type UserApplicant {
  id: Int!
  createdAt: String!
  ranking: Int!
  comment: String!          
  selected: Boolean!
  lecturer: User!
  applicant: Applicant!
}

  
type Query {
  courses:[Course!]!

  applicants:[Applicant!]!
  users:[User!]!

  listCandidateForCourse(courseId:Int!):[User!]!
  listCandidateNoChosen: [User!]!
  listCandidateChosenForMoreThreeCourses:[User!]!
}

type Mutation {

  adminLogin(email: String!, password: String!): Admin!
  adminLogout(token: String!): Boolean!

  assignLecturerToCourse(
    lecturerId:Int!, 
    courseId:Int!
  ):UserCourse!
  
  createCourse(courseName:String!):Course!
  
  deleteCourse(courseId:Int!):Boolean!
  
  editCourse(courseId:Int!,courseName:String!):Course!

  blockOrUnblockLogin(userId:Int!):Boolean!
}

type Subscription {
  blockStatusUpdated: User
}

`;
