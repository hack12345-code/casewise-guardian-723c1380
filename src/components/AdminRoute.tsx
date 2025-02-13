
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AdminRouteProps {
  children: React.ReactNode;
}

// Cache for admin status
let adminStatusCache: { [key: string]: boolean } = {};

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      // Check cache first
      if (adminStatusCache[session.user.id] !== undefined) {
        setIsAdmin(adminStatusCache[session.user.id]);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } else {
        const isAdminUser = data?.is_admin ?? false;
        adminStatusCache[session.user.id] = isAdminUser; // Cache the result
        setIsAdmin(isAdminUser);
      }
      
      setIsLoading(false);
    };

    checkAdminStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        adminStatusCache = {}; // Clear cache on sign out
      }
      checkAdminStatus();
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAdmin) {
    const returnUrl = encodeURIComponent(window.location.pathname);
    return <Navigate to={`/login?returnTo=${returnUrl}`} replace />;
  }

  return <>{children}</>;
};
