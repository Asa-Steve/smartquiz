import {
  getUser,
  getUserSession,
  signInWithOauth as signInWithOauthApi,
} from "@/services/authApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useSignInWithOauth() {
  const queryClient = useQueryClient();

  const { mutate: signInWithOauth, isPending } = useMutation({
    mutationFn: signInWithOauthApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: "user" });
    },
    onError: (e) => {
      alert("an error occured!", e?.message);
    },
  });

  return { signInWithOauth, isPending };
}

export function useGetUser() {
  const session = getUserSession();
  const { data, isLoading } = useQuery({
    queryFn: getUser,
    queryKey: ["user"],
    enabled: !!session,
  });

  return { data, isLoading };
}
