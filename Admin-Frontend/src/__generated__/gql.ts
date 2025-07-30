/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query GetAssignLecturerToCourseParams {\n    courses {\n        id\n        name\n    }\n    users {\n        email\n        id\n        role\n    }\n    }\n": typeof types.GetAssignLecturerToCourseParamsDocument,
    "\nmutation AssignLecturerToCourse($lecturerId: Int!, $courseId: Int!) {\n   assignLecturerToCourse(lecturerId: $lecturerId, courseId: $courseId)\n}\n": typeof types.AssignLecturerToCourseDocument,
    "\n  query CandidatesByCourse {\n courses {\n  id\n  name\n }\n applicants {\n  availability\n  skill\n  name\n  email\n  experience\n }\n}\n": typeof types.CandidatesByCourseDocument,
    "\n  query CourseTableCourseManage{\n    courses {\n        id\n        name\n    }\n    }\n": typeof types.CourseTableCourseManageDocument,
};
const documents: Documents = {
    "\n  query GetAssignLecturerToCourseParams {\n    courses {\n        id\n        name\n    }\n    users {\n        email\n        id\n        role\n    }\n    }\n": types.GetAssignLecturerToCourseParamsDocument,
    "\nmutation AssignLecturerToCourse($lecturerId: Int!, $courseId: Int!) {\n   assignLecturerToCourse(lecturerId: $lecturerId, courseId: $courseId)\n}\n": types.AssignLecturerToCourseDocument,
    "\n  query CandidatesByCourse {\n courses {\n  id\n  name\n }\n applicants {\n  availability\n  skill\n  name\n  email\n  experience\n }\n}\n": types.CandidatesByCourseDocument,
    "\n  query CourseTableCourseManage{\n    courses {\n        id\n        name\n    }\n    }\n": types.CourseTableCourseManageDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAssignLecturerToCourseParams {\n    courses {\n        id\n        name\n    }\n    users {\n        email\n        id\n        role\n    }\n    }\n"): (typeof documents)["\n  query GetAssignLecturerToCourseParams {\n    courses {\n        id\n        name\n    }\n    users {\n        email\n        id\n        role\n    }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation AssignLecturerToCourse($lecturerId: Int!, $courseId: Int!) {\n   assignLecturerToCourse(lecturerId: $lecturerId, courseId: $courseId)\n}\n"): (typeof documents)["\nmutation AssignLecturerToCourse($lecturerId: Int!, $courseId: Int!) {\n   assignLecturerToCourse(lecturerId: $lecturerId, courseId: $courseId)\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CandidatesByCourse {\n courses {\n  id\n  name\n }\n applicants {\n  availability\n  skill\n  name\n  email\n  experience\n }\n}\n"): (typeof documents)["\n  query CandidatesByCourse {\n courses {\n  id\n  name\n }\n applicants {\n  availability\n  skill\n  name\n  email\n  experience\n }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CourseTableCourseManage{\n    courses {\n        id\n        name\n    }\n    }\n"): (typeof documents)["\n  query CourseTableCourseManage{\n    courses {\n        id\n        name\n    }\n    }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;