import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Loader2, Mail } from "lucide-react";
import { verifyEmailToken } from "@/services/emailVerificationService";
import { toast } from "sonner";

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      if (!token || !email) {
        setVerificationResult({
          success: false,
          message: "Invalid verification link. Please check your email and try again."
        });
        setIsVerifying(false);
        return;
      }

      try {
        const result = await verifyEmailToken(token, email);
        setVerificationResult({
          success: result.success,
          message: result.message
        });

        if (result.success) {
          toast.success("Email verified successfully!");
          // Redirect to login page after 3 seconds
          setTimeout(() => {
            navigate("/auth");
          }, 3000);
        }
      } catch (error) {
        console.error("Email verification error:", error);
        setVerificationResult({
          success: false,
          message: "An error occurred during verification. Please try again."
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card/95 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 border border-border/30 text-center">
          <div className="mb-6">
            <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-2xl mb-4 ${
              isVerifying 
                ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                : verificationResult?.success 
                  ? 'bg-gradient-to-br from-green-500 to-green-600'
                  : 'bg-gradient-to-br from-red-500 to-red-600'
            }`}>
              {isVerifying ? (
                <Loader2 size={32} className="text-white animate-spin" />
              ) : verificationResult?.success ? (
                <CheckCircle size={32} className="text-white" />
              ) : (
                <AlertCircle size={32} className="text-white" />
              )}
            </div>
            
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {isVerifying 
                ? 'Verifying Email...' 
                : verificationResult?.success 
                  ? 'Email Verified!' 
                  : 'Verification Failed'
              }
            </h1>
            
            <p className="text-muted-foreground text-sm">
              {isVerifying 
                ? 'Please wait while we verify your email address.'
                : verificationResult?.message
              }
            </p>
          </div>

          {!isVerifying && (
            <div className="space-y-4">
              {verificationResult?.success ? (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-200 justify-center">
                    <Mail size={16} />
                    <span className="text-sm font-medium">Email successfully verified!</span>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                    You will be redirected to the login page in a few seconds.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <div className="flex items-center gap-2 text-red-800 dark:text-red-200 justify-center">
                    <AlertCircle size={16} />
                    <span className="text-sm font-medium">Verification failed</span>
                  </div>
                  <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                    The verification link may have expired or is invalid.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => navigate("/auth")}
                  className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl h-11"
                >
                  {verificationResult?.success ? 'Continue to Login' : 'Back to Login'}
                </Button>
                
                {!verificationResult?.success && (
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="px-4 rounded-xl h-11"
                  >
                    Retry
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}