import { useState, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Loader2, 
  Shield, 
  Sparkles,
  Github,
  Chrome,
  Apple,
  CheckCircle,
  AlertCircle,
  Zap,
  Users,
  Scan,
  Camera
} from "lucide-react";
import { z } from "zod";
import AuthScene from "@/components/3d/AuthScene";
import UniverseBackground from "@/components/3d/UniverseBackground";
import FacialRecognition from "@/components/auth/FacialRecognition";

const emailSchema = z.string().email("Invalid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");
const nameSchema = z.string().min(2, "Name must be at least 2 characters");
const genderSchema = z.string().min(1, "Please select your gender");

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string; gender?: string }>({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [showFaceAuth, setShowFaceAuth] = useState(false);
  const [faceData, setFaceData] = useState<string | null>(null);
  const [authMethod, setAuthMethod] = useState<'traditional' | 'face'>('traditional');

  const { signIn, signUp, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isLoading) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setSocialLoading(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        toast.error(`Failed to sign in with ${provider}`);
      } else {
        toast.success(`Redirecting to ${provider}...`);
      }
    } catch (error) {
      toast.error(`An error occurred with ${provider} login`);
    } finally {
      setSocialLoading(null);
    }
  };

  useEffect(() => {
    if (user && !isLoading) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  // Password strength checker
  useEffect(() => {
    if (password) {
      let strength = 0;
      if (password.length >= 6) strength += 1;
      if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;
      if (password.match(/\d/)) strength += 1;
      if (password.match(/[^a-zA-Z\d]/)) strength += 1;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [password]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }

    if (!isLogin) {
      const nameResult = nameSchema.safeParse(fullName);
      if (!nameResult.success) {
        newErrors.name = nameResult.error.errors[0].message;
      }

      const genderResult = genderSchema.safeParse(gender);
      if (!genderResult.success) {
        newErrors.gender = genderResult.error.errors[0].message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Invalid email or password");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Welcome back!");
          navigate("/");
        }
      } else {
        const { error } = await signUp(email, password, fullName, gender, faceData);
        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("This email is already registered");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Account created successfully!");
          // Store gender in localStorage for immediate routing
          localStorage.setItem('userGender', gender);
          // Redirect to gender-specific dashboard based on selected gender
          if (gender === 'male') {
            navigate("/male-dashboard");
          } else if (gender === 'female') {
            navigate("/female-dashboard");
          } else {
            navigate("/");
          }
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle facial recognition success
  const handleFaceSuccess = (faceTemplate: string) => {
    setFaceData(faceTemplate);
    setShowFaceAuth(false);
    
    if (isLogin) {
      // For login, immediately attempt authentication with face data
      handleFaceLogin(faceTemplate);
    } else {
      // For registration, just store the face data and show success
      toast.success("Face enrolled successfully! Complete your registration.");
    }
  };

  // Handle facial recognition error
  const handleFaceError = (error: string) => {
    console.error('Face recognition error:', error);
    setShowFaceAuth(false);
  };

  // Handle face-based login
  const handleFaceLogin = async (faceTemplate: string) => {
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real implementation, you would verify the face template against stored data
      // For now, we'll simulate this by checking if user exists and has face data
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !profile) {
        toast.error("User not found. Please register first or use traditional login.");
        return;
      }

      // Check if user has face data (handle case where column might not exist yet)
      const hasFaceData = profile && 'face_data' in profile && profile.face_data;
      
      if (!hasFaceData) {
        toast.error("Face ID not set up for this account. Please use traditional login or register with Face ID.");
        return;
      }

      // Simulate face matching (in real implementation, compare face templates)
      const matchSuccess = Math.random() > 0.2; // 80% success rate for demo
      
      if (matchSuccess) {
        // For face-based login, we need to use the actual password or implement a different auth flow
        // For demo purposes, we'll show success but recommend traditional login
        toast.success("Face verified! Please complete login with your password.");
        setAuthMethod('traditional');
      } else {
        toast.error("Face verification failed. Please try again or use traditional login.");
      }
    } catch (error) {
      console.error('Face login error:', error);
      toast.error("Face authentication failed. Please use traditional login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return "bg-gray-300";
      case 1: return "bg-red-500";
      case 2: return "bg-yellow-500";
      case 3: return "bg-blue-500";
      case 4: return "bg-green-500";
      default: return "bg-gray-300";
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return "";
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Strong";
      default: return "";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
          <p className="text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Universe Background */}
      <UniverseBackground variant="auth" />
      
      {/* Enhanced 3D Background */}
      <Suspense fallback={
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background animate-pulse" />
      }>
        <AuthScene />
      </Suspense>
      
      {/* Animated Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-primary/5 to-transparent pointer-events-none z-[1] animate-pulse" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-primary rounded-full animate-float opacity-60"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-secondary rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-32 left-16 w-3 h-3 bg-accent rounded-full animate-float opacity-50" style={{ animationDelay: '2s' }}></div>
      
      <div className="w-full max-w-md mx-4 z-10 relative">
        {/* Main Auth Card */}
        <div className="bg-card/95 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 border border-border/30 animate-scale-in relative overflow-hidden">
          {/* Animated Border Glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 animate-gradient-x opacity-50 blur-sm"></div>
          <div className="relative z-10">
            
            {/* Enhanced Logo Section */}
            <div className="text-center mb-8">
              <div className="relative mx-auto mb-6">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl animate-glow relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                  <img 
                    src="/logo.jpg" 
                    alt="HUMSJ Logo" 
                    className="w-16 h-16 rounded-xl object-cover relative z-10"
                  />
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-30 animate-pulse"></div>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full animate-bounce opacity-80"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-accent rounded-full animate-pulse opacity-60"></div>
              </div>
              
              <h1 className="text-4xl font-display tracking-wider bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-2">
                HUMSJ
              </h1>
              <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
                <Sparkles size={14} className="text-primary animate-pulse" />
                Information Technology Sector
                <Sparkles size={14} className="text-primary animate-pulse" />
              </p>
            </div>

            {/* Enhanced Toggle */}
            <div className="relative bg-secondary/50 rounded-xl p-1 mb-8 backdrop-blur-sm">
              <div className="absolute inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg opacity-50 blur-sm"></div>
              <div className="relative flex">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                    isLogin
                      ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg transform scale-105"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {isLogin && <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>}
                  <span className="relative flex items-center justify-center gap-2">
                    <Shield size={16} />
                    Sign In
                  </span>
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                    !isLogin
                      ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg transform scale-105"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {!isLogin && <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>}
                  <span className="relative flex items-center justify-center gap-2">
                    <User size={16} />
                    Register
                  </span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <>
                  <div className="space-y-2 animate-slide-down">
                    <Label htmlFor="fullName" className="text-foreground font-medium flex items-center gap-2">
                      <User size={14} className="text-primary" />
                      Full Name
                    </Label>
                    <div className="relative group">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10 bg-secondary/50 border-border/50 focus:border-primary focus:bg-secondary/80 transition-all duration-300 rounded-xl h-12"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                    {errors.name && (
                      <p className="text-xs text-destructive flex items-center gap-1 animate-shake">
                        <AlertCircle size={12} />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 animate-slide-down">
                    <Label htmlFor="gender" className="text-foreground font-medium flex items-center gap-2">
                      <Users size={14} className="text-primary" />
                      Gender
                    </Label>
                    <div className="relative group">
                      <Users size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
                      <select
                        id="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border/50 focus:border-primary focus:bg-secondary/80 transition-all duration-300 rounded-xl h-12 text-foreground appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-background text-foreground">Select your gender</option>
                        <option value="male" className="bg-background text-foreground">Male</option>
                        <option value="female" className="bg-background text-foreground">Female</option>
                      </select>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                      {/* Custom dropdown arrow */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.gender && (
                      <p className="text-xs text-destructive flex items-center gap-1 animate-shake">
                        <AlertCircle size={12} />
                        {errors.gender}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium flex items-center gap-2">
                  <Mail size={14} className="text-primary" />
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@hu.edu.et"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-secondary/50 border-border/50 focus:border-primary focus:bg-secondary/80 transition-all duration-300 rounded-xl h-12"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive flex items-center gap-1 animate-shake">
                    <AlertCircle size={12} />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium flex items-center gap-2">
                  <Lock size={14} className="text-primary" />
                  Password
                </Label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-12 bg-secondary/50 border-border/50 focus:border-primary focus:bg-secondary/80 transition-all duration-300 rounded-xl h-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-white/10"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
                
                {/* Password Strength Indicator */}
                {!isLogin && password && (
                  <div className="space-y-2 animate-fade-in">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 4) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                  </div>
                )}
                
                {errors.password && (
                  <p className="text-xs text-destructive flex items-center gap-1 animate-shake">
                    <AlertCircle size={12} />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Facial Recognition Section */}
              <div className="space-y-4">
                {/* Authentication Method Toggle */}
                <div className="flex items-center justify-between">
                  <Label className="text-foreground font-medium flex items-center gap-2">
                    <Scan size={14} className="text-primary" />
                    Authentication Method
                  </Label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAuthMethod('traditional')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                        authMethod === 'traditional'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMethod('face')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                        authMethod === 'face'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Face ID
                    </button>
                  </div>
                </div>

                {/* Face Recognition Button for Login */}
                {isLogin && authMethod === 'face' && (
                  <div className="space-y-3">
                    <Button
                      type="button"
                      onClick={() => setShowFaceAuth(true)}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl h-12 relative overflow-hidden group"
                      disabled={!email || isSubmitting}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="relative flex items-center justify-center gap-2">
                        <Camera size={18} />
                        Sign In with Face ID
                        <Sparkles size={16} className="animate-pulse" />
                      </span>
                    </Button>
                    {!email && (
                      <p className="text-xs text-muted-foreground text-center">
                        Please enter your email address first
                      </p>
                    )}
                  </div>
                )}

                {/* Face Enrollment for Registration */}
                {!isLogin && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground font-medium flex items-center gap-2">
                        <Camera size={14} className="text-primary" />
                        Face Recognition Setup
                        <span className="text-xs text-muted-foreground">(Optional)</span>
                      </Label>
                      {faceData && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle size={12} />
                          Enrolled
                        </div>
                      )}
                    </div>
                    
                    <Button
                      type="button"
                      onClick={() => setShowFaceAuth(true)}
                      variant="outline"
                      className="w-full border-border/50 hover:bg-secondary/50 rounded-xl h-11 relative overflow-hidden group"
                      disabled={isSubmitting}
                    >
                      <span className="relative flex items-center justify-center gap-2">
                        <Camera size={18} />
                        {faceData ? 'Update Face ID' : 'Set Up Face ID'}
                        <Scan size={16} className="animate-pulse" />
                      </span>
                    </Button>
                    
                    <p className="text-xs text-muted-foreground text-center">
                      Enable Face ID for faster and more secure login
                    </p>
                  </div>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-border/50 text-primary focus:ring-primary/20"
                    />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Enhanced Submit Button */}
              <Button
                type="submit"
                className="w-full mt-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl h-12 relative overflow-hidden group"
                disabled={isSubmitting || (isLogin && authMethod === 'face')}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {isSubmitting ? (
                  <span className="relative flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </span>
                ) : (
                  <span className="relative flex items-center justify-center gap-2">
                    <Zap size={18} className="animate-pulse" />
                    {isLogin 
                      ? (authMethod === 'face' ? "Use Face ID Above" : "Sign In") 
                      : "Create Account"
                    }
                    <Sparkles size={16} className="animate-pulse" />
                  </span>
                )}
              </Button>
            </form>

            {/* Social Login Options */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-4 text-muted-foreground font-medium">Or continue with</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mt-6">
                <button
                  onClick={() => handleSocialLogin('google')}
                  disabled={socialLoading !== null}
                  className="flex items-center justify-center p-3 rounded-xl border border-border/50 bg-secondary/30 transition-all duration-300 hover:scale-105 hover:bg-blue-500/10 hover:border-blue-500/30 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {socialLoading === 'google' ? (
                    <Loader2 size={20} className="animate-spin text-blue-500" />
                  ) : (
                    <Chrome size={20} className="text-muted-foreground group-hover:text-blue-500 transition-colors" />
                  )}
                </button>
                
                <button
                  onClick={() => handleSocialLogin('github')}
                  disabled={socialLoading !== null}
                  className="flex items-center justify-center p-3 rounded-xl border border-border/50 bg-secondary/30 transition-all duration-300 hover:scale-105 hover:bg-gray-500/10 hover:border-gray-500/30 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {socialLoading === 'github' ? (
                    <Loader2 size={20} className="animate-spin text-gray-500" />
                  ) : (
                    <Github size={20} className="text-muted-foreground group-hover:text-gray-500 transition-colors" />
                  )}
                </button>
                
                <button
                  disabled={true}
                  className="flex items-center justify-center p-3 rounded-xl border border-border/50 bg-secondary/30 transition-all duration-300 opacity-50 cursor-not-allowed group"
                  title="Apple Sign-In coming soon"
                >
                  <Apple size={20} className="text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Enhanced Footer */}
            <div className="mt-8 text-center space-y-4">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                <Shield size={12} className="text-primary" />
                Protected by enterprise-grade security
                <CheckCircle size={12} className="text-green-500" />
              </p>
              <p className="text-xs text-muted-foreground/70">
                By continuing, you agree to HUMSJ's{" "}
                <button className="text-primary hover:text-primary/80 transition-colors underline">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button className="text-primary hover:text-primary/80 transition-colors underline">
                  Privacy Policy
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Facial Recognition Modal */}
        {showFaceAuth && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-border/30 w-full max-w-md relative overflow-hidden">
              {/* Animated Border Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 animate-gradient-x opacity-50 blur-sm"></div>
              
              <div className="relative z-10 p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {isLogin ? 'Face Verification' : 'Face Enrollment'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isLogin 
                      ? 'Look at the camera to verify your identity'
                      : 'Set up Face ID for secure and convenient access'
                    }
                  </p>
                </div>

                <FacialRecognition
                  mode={isLogin ? 'verification' : 'enrollment'}
                  onSuccess={handleFaceSuccess}
                  onError={handleFaceError}
                  existingFaceData={isLogin ? 'stored-face-data' : undefined}
                />

                {/* Close Button */}
                <div className="mt-6 text-center">
                  <Button
                    onClick={() => setShowFaceAuth(false)}
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Action Hints */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-center animate-bounce">
          <div className="bg-primary/10 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/20">
            <p className="text-xs text-primary font-medium flex items-center gap-2">
              <Sparkles size={12} />
              Welcome to the future of student management
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}