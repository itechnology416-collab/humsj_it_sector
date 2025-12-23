import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Camera, 
  CameraOff, 
  Scan, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Eye,
  Shield,
  Sparkles,
  RefreshCw
} from "lucide-react";

interface FacialRecognitionProps {
  mode: 'enrollment' | 'verification';
  onSuccess: (faceData: string) => void;
  onError: (error: string) => void;
  className?: string;
  existingFaceData?: string; // For verification mode
}

export default function FacialRecognition({ 
  mode, 
  onSuccess, 
  onError, 
  className = "",
  existingFaceData 
}: FacialRecognitionProps) {
  const [isActive, setIsActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [step, setStep] = useState<'idle' | 'camera' | 'processing' | 'success' | 'error'>('idle');
  const [countdown, setCountdown] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    setStep('idle');
    setCapturedImage(null);
    setCountdown(0);
  }, [stream]);

  // Initialize camera
  const initializeCamera = async () => {
    try {
      setStep('camera');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setIsActive(true);
      
      // Start countdown for capture
      setTimeout(() => startCountdown(), 1000);
      
    } catch (error) {
      console.error('Camera access error:', error);
      let errorMessage = 'Failed to access camera';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Camera permission denied. Please allow camera access and try again.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No camera found. Please ensure you have a camera connected.';
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'Camera is being used by another application.';
        }
      }
      
      setStep('error');
      onError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Countdown before capture
  const startCountdown = () => {
    let count = 3;
    setCountdown(count);
    
    const countdownInterval = setInterval(() => {
      count--;
      setCountdown(count);
      
      if (count === 0) {
        clearInterval(countdownInterval);
        captureImage();
      }
    }, 1000);
  };

  // Capture image from video
  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setStep('processing');
    setIsProcessing(true);
    
    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) throw new Error('Canvas context not available');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to base64
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageData);
      
      // Simulate face processing (in real implementation, this would use face recognition library)
      await simulateFaceProcessing(imageData);
      
    } catch (error) {
      console.error('Image capture error:', error);
      setStep('error');
      onError('Failed to capture image. Please try again.');
      toast.error('Failed to capture image');
    } finally {
      setIsProcessing(false);
    }
  };

  // Simulate face processing (replace with actual face recognition library)
  const simulateFaceProcessing = async (imageData: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // In a real implementation, you would:
          // 1. Extract face features using a library like face-api.js
          // 2. Create face descriptors/embeddings
          // 3. For enrollment: store the face template
          // 4. For verification: compare with stored template
          
          // Simulate face detection
          const faceDetected = Math.random() > 0.1; // 90% success rate for demo
          
          if (!faceDetected) {
            throw new Error('No face detected. Please ensure your face is clearly visible.');
          }
          
          if (mode === 'verification' && existingFaceData) {
            // Simulate face matching
            const matchScore = Math.random();
            const threshold = 0.6;
            
            if (matchScore < threshold) {
              throw new Error('Face verification failed. Please try again.');
            }
          }
          
          // Generate mock face template (in real implementation, this would be actual face descriptors)
          const faceTemplate = btoa(JSON.stringify({
            timestamp: Date.now(),
            features: Array.from({ length: 128 }, () => Math.random()),
            imageHash: imageData.slice(-50) // Simple hash for demo
          }));
          
          setStep('success');
          cleanup();
          onSuccess(faceTemplate);
          toast.success(mode === 'enrollment' ? 'Face enrolled successfully!' : 'Face verified successfully!');
          resolve();
          
        } catch (error) {
          setStep('error');
          const errorMessage = error instanceof Error ? error.message : 'Face processing failed';
          onError(errorMessage);
          toast.error(errorMessage);
          reject(error);
        }
      }, 2000); // Simulate processing time
    });
  };

  // Reset and try again
  const resetCapture = () => {
    cleanup();
    setStep('idle');
  };

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const getStepIcon = () => {
    switch (step) {
      case 'idle':
        return <Camera size={24} className="text-primary" />;
      case 'camera':
        return <Scan size={24} className="text-blue-500 animate-pulse" />;
      case 'processing':
        return <Loader2 size={24} className="text-yellow-500 animate-spin" />;
      case 'success':
        return <CheckCircle size={24} className="text-green-500" />;
      case 'error':
        return <AlertCircle size={24} className="text-red-500" />;
      default:
        return <Camera size={24} className="text-primary" />;
    }
  };

  const getStepText = () => {
    switch (step) {
      case 'idle':
        return mode === 'enrollment' ? 'Enroll Your Face' : 'Verify Your Face';
      case 'camera':
        return countdown > 0 ? `Get ready... ${countdown}` : 'Position your face in the frame';
      case 'processing':
        return 'Processing face data...';
      case 'success':
        return mode === 'enrollment' ? 'Face enrolled!' : 'Face verified!';
      case 'error':
        return 'Please try again';
      default:
        return 'Face Recognition';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-foreground">
          <Eye size={16} className="text-primary" />
          Face Recognition
          <Shield size={16} className="text-primary" />
        </div>
        <p className="text-xs text-muted-foreground">
          {mode === 'enrollment' 
            ? 'Secure your account with facial recognition' 
            : 'Verify your identity with your face'
          }
        </p>
      </div>

      {/* Camera Container */}
      <div className="relative bg-secondary/30 rounded-xl border border-border/50 overflow-hidden">
        {/* Video Preview */}
        <div className="relative aspect-video bg-black/20 flex items-center justify-center">
          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${isActive ? 'block' : 'hidden'}`}
            autoPlay
            muted
            playsInline
          />
          
          {/* Overlay Elements */}
          {isActive && (
            <>
              {/* Face Detection Frame */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-primary rounded-full animate-pulse opacity-60">
                  <div className="absolute inset-2 border border-primary/50 rounded-full"></div>
                </div>
              </div>
              
              {/* Countdown */}
              {countdown > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-6xl font-bold text-white animate-bounce">
                    {countdown}
                  </div>
                </div>
              )}
              
              {/* Processing Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                  <div className="text-center text-white space-y-4">
                    <Loader2 size={48} className="animate-spin mx-auto" />
                    <p className="text-sm">Analyzing face...</p>
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* Placeholder when camera is off */}
          {!isActive && (
            <div className="text-center space-y-4 p-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                {step === 'idle' ? (
                  <CameraOff size={32} className="text-muted-foreground" />
                ) : (
                  getStepIcon()
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">{getStepText()}</p>
                {step === 'idle' && (
                  <p className="text-xs text-muted-foreground">
                    Click the button below to start
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Status Bar */}
        <div className="p-3 bg-secondary/50 border-t border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {getStepIcon()}
              <span>{getStepText()}</span>
            </div>
            {isActive && (
              <div className="flex items-center gap-1 text-xs text-green-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {step === 'idle' && (
          <Button
            onClick={initializeCamera}
            className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl h-11 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative flex items-center justify-center gap-2">
              <Camera size={18} />
              Start {mode === 'enrollment' ? 'Enrollment' : 'Verification'}
              <Sparkles size={16} className="animate-pulse" />
            </span>
          </Button>
        )}
        
        {(step === 'error' || step === 'success') && (
          <Button
            onClick={resetCapture}
            variant="outline"
            className="flex-1 border-border/50 hover:bg-secondary/50 rounded-xl h-11"
          >
            <RefreshCw size={18} className="mr-2" />
            Try Again
          </Button>
        )}
        
        {isActive && !isProcessing && (
          <Button
            onClick={cleanup}
            variant="outline"
            className="flex-1 border-border/50 hover:bg-secondary/50 rounded-xl h-11"
          >
            <CameraOff size={18} className="mr-2" />
            Cancel
          </Button>
        )}
      </div>

      {/* Hidden Canvas for Image Capture */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Security Notice */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground/70 flex items-center justify-center gap-1">
          <Shield size={10} />
          Your face data is encrypted and stored securely
        </p>
      </div>
    </div>
  );
}