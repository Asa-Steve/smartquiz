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
      toast.error("Error creating user profile");
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
    toast.error("Couldn't get user");
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

  // Login with username (converts username to email first)
  const { mutateAsync: loginWithUsername, isPending: isLoggingInWithUsername } =
    useMutation({
      mutationFn: async ({ username, password }) => {
        // First, get the email from username
        const userProfile = await getUserProfileByUsername(username);
        console.log({ userProfile });
        if (!userProfile?.email) {
          throw new Error("User not found");
        }

        // Then login with that email directly (don't call another mutation)
        const { data, error } = await supabase.auth.signInWithPassword({
          email: userProfile.email,
          password,
        });

        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        toast.success("Login successful");
        queryClient.invalidateQueries({ queryKey: ["auth-session"] });
      },
      onError: (error) => {
        toast.error("Couldn't login user");
        console.error("Error logging in with username:", error.message);
      },
    });

  // Register User
  const { mutate: register, isPending: isRegisteringUser } = useMutation({
    mutationFn: async (newUser) => {
      if (!newUser) {
        throw new Error("User data required");
      }

      const { username, email, password } = newUser;

      //checking if username already exists
      const { data: usernameExists } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .maybeSingle();

      if (usernameExists) {
        throw new Error("username already in use by another user!");
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) throw new Error("Error creating account. Please try again.");
      return data;
    },
    onSuccess: (data) => {
      if (data == null) return;
      // Check if user already exists by looking at identities array
      const isExistingUser = data.user?.identities?.length === 0;

      if (isExistingUser) {
        toast.warning(
          "This email is already registered. Please log in instead."
        );
      } else {
        toast.success(
          "Account created! Check your email for the verification link."
        );
      }

      queryClient.invalidateQueries({ queryKey: ["auth-session"] });
    },
    onError: (error) => {
      toast.error(error?.message);
      console.error("Error registering user:", error);
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

  //   Updating highscore
  const { mutate: updateScore, isPending: isUpdatingScore } = useMutation({
    mutationFn: async ({ score, highest_qnum }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ highscore: score, highest_qnum })
        .eq("user_id", session?.user?.id);

      if (error) {
        console.log(error);
      }
    },
  });

  return {
    user,
    session,
    loadingUser: sessionLoading || userLoading,
    register,
    isRegisteringUser,
    loginWithUsername,
    isLoggingIn: isLoggingInWithUsername,
    signInWithOAuth,
    isSigningInWithOAuth,
    updateScore,
    isUpdatingScore,
    signOut,
    isSigningOut,
  };
}
