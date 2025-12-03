import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";
import { useState } from "react";

async function createUserProfile(user) {
  if (!user) return null;

  try {
    const { data: userProfile, error } = await supabase
      .from("profiles")
      .insert({
        email: user.email,
        username: user.user_metadata?.full_name,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        // Profile exists, fetch it
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();
        return data;
      }
      console.error("Error creating user profile:", error);
      return null;
    }

    return userProfile;
  } catch (err) {
    console.error("Exception in createUserProfile:", err);
    return null;
  }
}

async function getUserProfile(userId) {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;

    // If no profile exists, create one
    if (!data) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return await createUserProfile(user);
    }

    return data;
  } catch (err) {
    console.error("Exception in getUserProfile:", err);
    return null;
  }
}

export function useAuth() {
  const queryClient = useQueryClient();
  const [isSigningInWithOAuth, setIsSigningInWithOAuth] = useState(false);

  // Query for auth session
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  // Query for user profile
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user-profile", session?.user?.id],
    queryFn: () => getUserProfile(session?.user?.id),
    enabled: !!session?.user?.id,
    staleTime: 1000 * 60 * 5,
  });

  // Sign in with OAuth
  const signInWithOAuth = async () => {
    try {
      setIsSigningInWithOAuth(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;
    } catch (error) {
      setIsSigningInWithOAuth(false);
      throw error;
    }
  };

  // Sign out mutation
  const { mutateAsync: signOut, isPending: isSigningOut } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth-session"], null);
      queryClient.setQueryData(["user-profile"], null);
    },
  });

  return {
    user,
    session,
    loadingUser: sessionLoading || userLoading,
    signInWithOAuth,
    isSigningInWithOAuth,
    signOut,
    isSigningOut,
  };
}
