
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bdyudlqxufggzdzolayb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkeXVkbHF4dWZnZ3pkem9sYXliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0NzIwMDcsImV4cCI6MjA1NTA0ODAwN30.eJP_nC3ylOJaX-tWirZQjlArHjsqOp3kHy_UxY5u7zA";

const createCustomClient = () => {
  const client = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  });

  // Create a wrapper for the from method
  const originalFrom = client.from.bind(client);
  const enhancedFrom = (table: keyof Database['public']['Tables']) => {
    const queryBuilder = originalFrom(table);
    
    if (table === 'medical_messages' || table === 'medical_chats') {
      const originalInsert = queryBuilder.insert.bind(queryBuilder);
      const newInsert = async (values: Database['public']['Tables'][typeof table]['Insert']) => {
        const { data: { user } } = await client.auth.getUser();
        if (!user?.id) {
          throw new Error('User not authenticated');
        }

        const { data: profile } = await originalFrom('profiles')
          .select('is_blocked, case_blocked')
          .eq('id', user.id)
          .maybeSingle();

        if (profile?.is_blocked) {
          throw new Error('Your account is blocked from sending messages.');
        }

        if (table === 'medical_chats' && profile?.case_blocked) {
          throw new Error('Your account is blocked from creating new cases.');
        }

        return originalInsert(values);
      };

      // Preserve the original insert method's type signature
      queryBuilder.insert = newInsert as typeof queryBuilder.insert;
    }

    return queryBuilder;
  };

  // Replace the from method with our enhanced version
  client.from = enhancedFrom as typeof client.from;

  return client;
};

export const supabase = createCustomClient();
