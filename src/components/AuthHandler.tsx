import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const AuthHandler = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      try {
        // Get the current URL hash
        const hashParams = window.location.hash;
        
        if (hashParams && hashParams.includes('access_token')) {
          // Remove the hash but keep the path
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );

          // Get the session to confirm authentication
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) throw error;
          
          if (session) {
            // Check if user is admin
            const isAdmin = session.user.email === 'savesuppo@gmail.com';
            
            // Navigate to the appropriate dashboard
            navigate(isAdmin ? '/admin' : '/dashboard', { replace: true });
            
            toast({
              title: "Successfully logged in",
              description: "Welcome back!",
            });
          }
        }
      } catch (error: any) {
        console.error('Auth redirect error:', error);
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
        navigate('/login', { replace: true });
      }
    };

    handleAuthRedirect();
  }, [navigate, toast]);

  return null; // This component doesn't render anything
};
