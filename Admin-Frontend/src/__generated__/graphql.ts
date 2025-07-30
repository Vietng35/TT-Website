/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Applicant = {
  __typename?: 'Applicant';
  availability?: Maybe<Scalars['String']['output']>;
  course?: Maybe<Course>;
  courseId?: Maybe<Scalars['Int']['output']>;
  credential?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  experience?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  skill?: Maybe<Scalars['String']['output']>;
  tutorId?: Maybe<Scalars['Int']['output']>;
};

export type Book = {
  __typename?: 'Book';
  author?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type Course = {
  __typename?: 'Course';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  assignLecturerToCourse?: Maybe<Scalars['Boolean']['output']>;
};


export type MutationAssignLecturerToCourseArgs = {
  courseId: Scalars['Int']['input'];
  lecturerId: Scalars['Int']['input'];
};

export type Query = {
  __typename?: 'Query';
  applicants: Array<Applicant>;
  books?: Maybe<Array<Maybe<Book>>>;
  courses: Array<Course>;
  users: Array<User>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  hashPassword: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  role: Scalars['String']['output'];
  token: Scalars['String']['output'];
};

export type GetAssignLecturerToCourseParamsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAssignLecturerToCourseParamsQuery = { __typename?: 'Query', courses: Array<{ __typename?: 'Course', id: number, name: string }>, users: Array<{ __typename?: 'User', email: string, id: number, role: string }> };

export type AssignLecturerToCourseMutationVariables = Exact<{
  lecturerId: Scalars['Int']['input'];
  courseId: Scalars['Int']['input'];
}>;


export type AssignLecturerToCourseMutation = { __typename?: 'Mutation', assignLecturerToCourse?: boolean | null };

export type CandidatesByCourseQueryVariables = Exact<{ [key: string]: never; }>;


export type CandidatesByCourseQuery = { __typename?: 'Query', courses: Array<{ __typename?: 'Course', id: number, name: string }>, applicants: Array<{ __typename?: 'Applicant', availability?: string | null, skill?: string | null, name?: string | null, email?: string | null, experience?: string | null }> };

export type CourseTableCourseManageQueryVariables = Exact<{ [key: string]: never; }>;


export type CourseTableCourseManageQuery = { __typename?: 'Query', courses: Array<{ __typename?: 'Course', id: number, name: string }> };


export const GetAssignLecturerToCourseParamsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAssignLecturerToCourseParams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<GetAssignLecturerToCourseParamsQuery, GetAssignLecturerToCourseParamsQueryVariables>;
export const AssignLecturerToCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignLecturerToCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lecturerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignLecturerToCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lecturerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lecturerId"}}},{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}]}]}}]} as unknown as DocumentNode<AssignLecturerToCourseMutation, AssignLecturerToCourseMutationVariables>;
export const CandidatesByCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CandidatesByCourse"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"applicants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"availability"}},{"kind":"Field","name":{"kind":"Name","value":"skill"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"experience"}}]}}]}}]} as unknown as DocumentNode<CandidatesByCourseQuery, CandidatesByCourseQueryVariables>;
export const CourseTableCourseManageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CourseTableCourseManage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CourseTableCourseManageQuery, CourseTableCourseManageQueryVariables>;