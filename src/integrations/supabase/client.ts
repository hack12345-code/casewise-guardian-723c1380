// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bdyudlqxufggzdzolayb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkeXVkbHF4dWZnZ3pkem9sYXliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0NzIwMDcsImV4cCI6MjA1NTA0ODAwN30.eJP_nC3ylOJaX-tWirZQjlArHjsqOp3kHy_UxY5u7zA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);