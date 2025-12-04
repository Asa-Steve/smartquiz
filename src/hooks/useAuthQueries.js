import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";
import { useState } from "react";
import { toast } from "sonner";

async function getUserProfileByUsername(username) {
  const { data, error } = await supabase
    .from("profiles")
    .select("email")
    .eq("username", username)
    .maybeSingle();

  if (error) {
    console.log("Error", error?.message);
    return null;
  }

  return data;
}

async function createUserProfile(user) {
  if (!user) return null;

  try {
    const { data: userProfile, error } = await supabase
      .from("profiles")
      .insert({
        email: user.email,
        username: user.user_metadata?.full_name ?? user.user_metadata?.username,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();
        return data;
      }
      toast("Error creating user profile");
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

    if (!data) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return await createUserProfile(user);
    }

    return data;
  } catch (err) {
    toast("couldn't get user");
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

  // Login user with email/password
  const { mutateAsync: loginWithEmail, isPending: isLoggingInWithEmail } =
    useMutation({
      mutationFn: async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.log(error);
          throw error;
        }
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["auth-session"] });
      },
      onError: () => toast("couldn't login user"),
    });

  // Login with username (converts username to email first)
  const { mutateAsync: loginWithUsername, isPending: isLoggingInWithUsername } =
    useMutation({
      mutationFn: async ({ username, password }) => {
        // First, get the email from username
        const userProfile = await getUserProfileByUsername(username);

        if (!userProfile?.email) {
          throw new Error("User not found");
        }

        // Then login with email
        return await loginWithEmail({ email: userProfile.email, password });
      },
      onError: (error) => {
        console.error("Error logging in with username:", error.message);
      },
    });

  // Register User
  const { mutate: register, isPending: isRegisteringUser } = useMutation({
    mutationFn: async (newUser) => {
      if (!newUser) throw new Error("User data required");

      const { username, email, password } = newUser;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-session"] });
    },
    onError: (error) => {
      console.error("Error registering user:", error.message);
    },
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
    register,
    isRegisteringUser,
    loginWithUsername,
    isLoggingIn: isLoggingInWithEmail || isLoggingInWithUsername,
    signInWithOAuth,
    isSigningInWithOAuth,
    signOut,
    isSigningOut,
  };
}
