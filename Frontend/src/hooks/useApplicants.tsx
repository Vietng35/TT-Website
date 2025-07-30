import { CreateApplicantPayload, GetApplicantsResponse } from "@/Utils/Submit";
import { useAuth } from "./useAuth";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface CreateApplicantResponse {
  status: boolean;
  message: string;
}

export const searchOptions = [
  "name",
  "availability",
  "skill",
  "course",
  "role"
] as const;

export interface GetApplicationFilter {
  searchTerm?: string;
  searchOption?: (typeof searchOptions)[number];
  sortBy?: "courseName" | "availability";
}

// export const useLecturerCourses = (user?: User | null) =>
//   const getLecturerCourse=useQuery({
//     queryKey: ["courses", user?.id],
//     queryFn: () =>
//       axios.get(`/lecturers/${user?.id}/courses`).then(r => r.data),
//     enabled: !!user?.id && user?.role === "Lecturer",
//   });

export function useApplicants(filter: GetApplicationFilter) {

  const { user } = useAuth();

  const coursesQuery = useQuery({
    queryKey: ["courses", user?.id],
    queryFn: () =>
      axios
        .get(`http://localhost:3000/lecturers/${user?.id}/courses`)
        .then(r => r.data),
    enabled: !!user?.id && user?.role === "Lecturer",
  });

  const selectedApplicantsQuery = useQuery({
    queryKey: ["selected", user?.id, filter],
    queryFn: () =>
      axios.get<GetApplicantsResponse>(`http://localhost:3000/applicants`, {
        params: { lecturerId: user?.id, ...filter, isSelected: true },
      }),
    enabled: !!user?.id,
  });

  const notSelectedApplicantsQuery = useQuery({
    queryKey: ["notSelected", user?.id, filter],
    queryFn: () =>
      axios.get<GetApplicantsResponse>(`http://localhost:3000/applicants`, {
        params: { lecturerId: user?.id, ...filter, isSelected: false },
      }),
    enabled: !!user?.id,
  });

  const refetch = () => {
    selectedApplicantsQuery.refetch();
    notSelectedApplicantsQuery.refetch();
  };

  // create applicant
  //instead of write id in newApplicant -> omit can use in it, and dont need to declare something file
  const createApplicant = async (
    newApplicant: Omit<CreateApplicantPayload, "id">
  ) => {
    const response = await axios.post(
      "http://localhost:3000/applicants",
      newApplicant
    );
    const responeJson = response.data as CreateApplicantResponse;
    if (responeJson.status) {
      alert("Account Created Completed");
    } else {
      alert(responeJson.message);
    }
    return responeJson.status;
  };

  const updateBlock = async () => {
    refetch();
  }

  const selectApplicant = async (applicantId: number) => {
    const response = await axios.post(
      `http://localhost:3000/applicants/${user?.id}/select`,
      { applicantId, selected: true }
    );
    refetch();
    const responeJson = response.data as CreateApplicantResponse;
    if (responeJson.status) {
      alert("Applicant Selected");
    } else {
      alert(responeJson.message);
    }
    return responeJson.status;
  };

  const deselectApplicant = async (applicantId: number) => {
    const result = window.confirm(
      "Are you sure you want to deselect this applicant?"
    );
    if (!result) return;
    const response = await axios.post(
      `http://localhost:3000/applicants/${user?.id}/select`,
      { applicantId, selected: false }
    );
    refetch();
    const responeJson = response.data as CreateApplicantResponse;
    if (!responeJson.status) alert(responeJson.message);
  };

  const setApplicantRanking = async (applicantId: number, ranking: number) => {
    await axios.post(`http://localhost:3000/applicants/${user?.id}/ranking`, {
      applicantId,
      ranking,
    });
    refetch();
  };

  const updateComment = async (applicantId: number, comment: string) => {
    await axios.post(`http://localhost:3000/applicants/${user?.id}/comment`, {
      applicantId,
      comment,
    });
    refetch();
  };

  

  return {
    courses: Array.isArray(coursesQuery.data) ? coursesQuery.data : [],
    coursesLoading: coursesQuery.isLoading,
    courseError: coursesQuery.isError,
    selectedApplicants: selectedApplicantsQuery.data?.data,
    notSelectedApplicants: notSelectedApplicantsQuery.data?.data,
    createApplicant,
    selectApplicant,
    deselectApplicant,
    setApplicantRanking,
    updateComment,
    updateBlock
  };
}