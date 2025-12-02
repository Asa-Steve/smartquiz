import { getQuestions } from "@/services/questionApi";
import { useQuery } from "@tanstack/react-query";

export function useQuestions({ topic, qNum, difficulty } = {}) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["questions", { topic, qNum, difficulty }],
    queryFn: () => getQuestions({ topic, qNum, difficulty }),
    enabled: false,
    retry: 1,
  });

  return { data, isLoading, refetch };
}
