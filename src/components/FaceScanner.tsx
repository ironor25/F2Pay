
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Camera } from "lucide-react";

interface FaceScannerProps {
  onCapture: (faceData: string) => void;
  actionText: string;
}

const FaceScanner: React.FC<FaceScannerProps> = ({ onCapture, actionText }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const { toast } = useToast();
  
  // Initialize the webcam
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 320, 
          height: 240,
          facingMode: "user" 
        }, 
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreaming(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to use facial authentication",
        variant: "destructive",
      });
    }
  };
  
  // Stop the camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      setStreaming(false);
    }
  };
  
  // Capture face data from video stream
  const captureFace = () => {
    setCountdown(3);
  };
  
  // Countdown effect for capturing
  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    
    if (countdown === 0) {
      // Take the snapshot
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const context = canvas.getContext('2d');
        if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = canvas.toDataURL('image/png');
          onCapture(imageData);
          setCountdown(null);
          stopCamera();
        }
      }
    }
  }, [countdown, onCapture]);
  
  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);
  
  return (
    <div className="flex flex-col items-center space-y-4 p-4 rounded-md">
      <div className="relative bg-gray-100 rounded-md overflow-hidden" style={{ height: 240, width: 320 }}>
        {!streaming ? (
          <div className="h-full w-full flex items-center justify-center">
            <Camera className="h-16 w-16 text-gray-400" />
          </div>
        ) : (
          <div className="relative">
            <video ref={videoRef} className="rounded-md" style={{ maxWidth: '100%' }} />
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="text-white text-6xl font-bold">{countdown}</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {!streaming ? (
        <Button 
          onClick={startCamera} 
          className="w-full"
          variant="outline"
        >
          <Camera className="mr-2 h-4 w-4" />
          Enable Camera
        </Button>
      ) : (
        <Button 
          onClick={captureFace} 
          className="w-full"
          disabled={countdown !== null}
        >
          {countdown !== null ? `Capturing in ${countdown}...` : actionText}
        </Button>
      )}
    </div>
  );
};

export default FaceScanner;
