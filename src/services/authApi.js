import { supabase } from "./supabase";

export async function signInWithOauth() {
  let { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function getUserSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error("cannot get user");
  }

  return data.session;
}

export async function getUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error("failed to get user");
  }

  return data;
}
