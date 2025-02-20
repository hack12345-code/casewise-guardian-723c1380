
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bdyudlqxufggzdzolayb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkeXVkbHF4dWZnZ3pkem9sYXliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0NzIwMDcsImV4cCI6MjA1NTA0ODAwN30.eJP_nC3ylOJaX-tWirZQjlArHjsqOp3kHy_UxY5u7zA";

// Create a custom type that extends the base client
const createCustomClient = () => {
  const client = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

  // Intercept all medical_messages inserts to check if user is blocked
  const originalFrom = client.from;
  client.from = (table: string) => {
    const queryBuilder = originalFrom(table);
    const originalInsert = queryBuilder.insert;

    if (table === 'medical_messages' || table === 'medical_chats') {
      queryBuilder.insert = async (values: any) => {
        // Check if user is blocked before allowing insert
        const { data: profile } = await client
          .from('profiles')
          .select('is_blocked, case_blocked')
          .eq('id', client.auth.getUser().then(res => res.data.user?.id))
          .single();

        if (profile?.is_blocked) {
          throw new Error('Your account is blocked from sending messages.');
        }

        if (table === 'medical_chats' && profile?.case_blocked) {
          throw new Error('Your account is blocked from creating new cases.');
        }

        return originalInsert(values);
      };
    }

    return queryBuilder;
  };

  return client;
};

export const supabase = createCustomClient();
