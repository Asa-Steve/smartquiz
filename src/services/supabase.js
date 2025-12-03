import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://ekmbxvhtjpjybbiqeite.supabase.co";
export const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbWJ4dmh0anBqeWJiaXFlaXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1OTkxODYsImV4cCI6MjA4MDE3NTE4Nn0.4iz9n_DiI2lWnMFFxXy_xWGI-P0frWooM6Q4364ZAO4";
export const supabase = createClient(supabaseUrl, supabaseKey);
