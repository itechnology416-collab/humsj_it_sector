import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface GenderBasedDashboardProps {
  defaultGender?: 'male' | 'female';
}

export function GenderBasedDashboard({ defaultGender = 'male' }: GenderBasedDashboardProps) {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      // In a real application, you would get the gender from the user profile
      // For now, we'll use a simple logic or default
      
      // Check if user has gender preference stored in localStorage
      const storedGender = localStorage.getItem('userGender') as 'male' | 'female' | null;
      
      if (storedGender) {
        navigate(storedGender === 'male' ? '/male-dashboard' : '/female-dashboard', { replace: true });
      } else {
        // Default behavior - could be based on user profile data
        navigate(defaultGender === 'male' ? '/male-dashboard' : '/female-dashboard', { replace: true });
      }
    } else if (!isLoading && !user) {
      // Redirect to auth if not logged in
      navigate('/auth', { replace: true });
    }
  }, [user, isLoading, navigate, defaultGender]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return null;
}