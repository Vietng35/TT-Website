export interface CreateApplicantPayload {
  courseId: number;
  availability: string;
  role: string;
  credential: string;
  experience: string;
  skill: string;
  tutorId: number;
}

export type GetApplicantsResponse = Array<
  CreateApplicantPayload & {
    id: number;
    userapplicants: {
      comment: string;
      createdAt: string;
      id: number;
      ranking: number;
      selected: boolean;
      lecturer: { id: number, email: string };
    }[];
    tutor: {
      name: string;
      email: string;
      isBlock: boolean
    };
    course: { id: number; name: string };
  }
>;