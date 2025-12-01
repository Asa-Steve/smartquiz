import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://ekmbxvhtjpjybbiqeite.supabase.co";
export const supabaseKey = "sb_publishable_or6ohnyNNnQJz26egPE7Fg_bQ-7G08x";
export const supabase = createClient(supabaseUrl, supabaseKey);
