import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { Loader2, Shield, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProtectedPageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  currentPath: string;
  onNavigate: (path: string) => void;
  requiresAuth?: boolean;
}

export function ProtectedPageLayout({ 
  children, 
  title, 
  subtitle, 
  currentPath, 
  onNavigate,
  requiresAuth = true 
}: ProtectedPageLayoutProps) {
  const { user, loading, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && requiresAuth && !user) {
      toast.error("Please login to access this page");
      navigate("/auth", { 
        state: { 
          redirectTo: currentPath,
          message: "Authentication required to access this page" 
        } 
      });
    }
  }, [user, loading, requiresAuth, navigate, currentPath]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background pattern-netflix pattern-grid flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Loader2 size={32} className="text-primary animate-spin" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Verifying Authentication</h3>
            <p className="text-muted-foreground text-sm">
              Please wait while we verify your login status...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show authentication required message if not logged in
  if (requiresAuth && !user) {
    return (
      <div className="min-h-screen bg-background pattern-netflix pattern-grid flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
              <Lock size={32} className="text-amber-500" />
            </div>
            <CardTitle className="text-center text-xl">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You need to be logged in to access this page. Please sign in to continue.
            </p>
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => navigate("/auth")}
                className="w-full gap-2"
              >
                <Shield size={16} />
                Sign In / Register
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full"
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If authenticated or auth not required, render the protected content
  return (
    <PageLayout
      title={title}
      subtitle={subtitle}
      currentPath={currentPath}
      onNavigate={onNavigate}
    >
      {children}
    </PageLayout>
  );
}