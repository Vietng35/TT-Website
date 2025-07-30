import axios from "axios";

/**
 * 
 * @param lecturerId Lecturer's ID
 * @returns Assigned courses to lecturer depends on lectureId
 */
export async function getLecturerCourses(lecturerId: number) {
  const { data } = await axios.get(`/lecturers/${lecturerId}/courses`);
  return data;              
}