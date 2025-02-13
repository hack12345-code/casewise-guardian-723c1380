
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Don't scroll to top if the pathname includes "cases" (for the navbar cases section)
    if (!pathname.includes('cases')) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};
