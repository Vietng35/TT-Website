import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Course {
  id: number;
  name: string;
}

export function useCourses(lectureId = 0) {
  const { data: courses } = useQuery({
    queryKey: ["courses", lectureId],
    queryFn: () =>
      axios.get(`http://localhost:3000/courses?lecture_id=${lectureId}`),
  });
  return (courses?.data ?? []) as Course[];
}
