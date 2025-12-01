import { getQuestions } from "@/services/questionApi";
import { useQuery } from "@tanstack/react-query";

export function useQuestions({ topic, qNum, difficulty, start } = {}) {
  const { data, isLoading } = useQuery({
    queryKey: ["questions"],
    queryFn: () => getQuestions({ topic, qNum, difficulty }),
    enabled: !!start,
    retry: 1,
  });

  return { data, isLoading };
}
