import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LogOut, 
  Shield, 
  Clock, 
  CheckCircle,
  Loader2,
  ArrowLeft,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Logout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutComplete, setLogoutComplete] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (logoutComplete && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (logoutComplete && countdown === 0) {
      navigate("/");
    }
  }, [logoutComplete, countdown, navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      setLogoutComplete(true);
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  if (logoutComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6 animate-fade-in">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
              <CheckCircle size={40} className="text-green-400" />
            </div>
            <h1 className="text-3xl font-display tracking-wide mb-4">Logged Out Successfully</h1>
            <p className="text-muted-foreground mb-6">
              You have been safely logged out of your account. Thank you for using our platform.
            </p>
            <div className="bg-card rounded-xl p-6 border border-border/30 mb-6">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                <Clock size={16} />
                <span>Redirecting to home page in {countdown} seconds...</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                />
              </div>
            </div>
            <Button 
              onClick={() => navigate("/")}
              className="w-full bg-primary hover:bg-primary/90 gap-2"
            >
              <Home size={16} />
              Go to Home Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 animate-fade-in">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6 animate-float">
            <LogOut size={40} className="text-red-400" />
          </div>
          <h1 className="text-3xl font-display tracking-wide mb-4">Sign Out</h1>
          <p className="text-muted-foreground mb-8">
            Are you sure you want to sign out of your account?
          </p>
        </div>

        {user && (
          <div className="bg-card rounded-xl p-6 border border-border/30 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-lg font-display text-primary-foreground">
                  {user.email?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium">{user.email}</p>
                <p className="text-sm text-muted-foreground">Current session</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-card rounded-xl p-6 border border-border/30 space-y-4">
          <div className="flex items-start gap-3">
            <Shield size={20} className="text-amber-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm mb-1">Security Notice</h3>
              <p className="text-xs text-muted-foreground">
                Signing out will end your current session and require you to log in again to access your account.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Clock size={20} className="text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm mb-1">Session Information</h3>
              <p className="text-xs text-muted-foreground">
                Your session data will be cleared from this device. Any unsaved changes may be lost.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full bg-red-500 hover:bg-red-500/90 text-white gap-2"
          >
            {isLoggingOut ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing Out...
              </>
            ) : (
              <>
                <LogOut size={16} />
                Sign Out
              </>
            )}
          </Button>
          
          <Button 
            onClick={handleCancel}
            variant="outline"
            disabled={isLoggingOut}
            className="w-full border-border/50 hover:border-primary gap-2"
          >
            <ArrowLeft size={16} />
            Cancel
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Need help? Contact our{" "}
            <button 
              onClick={() => navigate("/support")}
              className="text-primary hover:underline"
            >
              support team
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}