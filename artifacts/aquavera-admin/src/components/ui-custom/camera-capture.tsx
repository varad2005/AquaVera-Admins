import React, { useState, useRef, useEffect, useCallback } from "react";
import { Camera, MapPin, Clock, Smartphone, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CaptureData {
  image: string;
  latitude: number | null;
  longitude: number | null;
  timestamp: string;
  device: string;
}

interface CameraCaptureProps {
  onCapture: (data: CaptureData) => void;
  onClear: () => void;
  className?: string;
}

export function CameraCapture({ onCapture, onClear, className }: CameraCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedData, setCapturedData] = useState<CaptureData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // -------------------------------------------------------------------
  // CAMERA LOGIC
  // -------------------------------------------------------------------
  const startCamera = async () => {
    setError(null);
    setIsCapturing(true);
  };

  useEffect(() => {
    if (isCapturing && !capturedData) {
      const initCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment" }, 
            audio: false 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            streamRef.current = stream;
          }
        } catch (err) {
          setError("Please allow camera access to continue.");
          setIsCapturing(false);
          console.error("Camera error:", err);
        }
      };
      initCamera();
    }
  }, [isCapturing, capturedData]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  }, []);

  // -------------------------------------------------------------------
  // CAPTURE LOGIC
  // -------------------------------------------------------------------
  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/jpeg", 0.8);
      
      stopCamera();
      
      // Collect Metadata
      setLocationLoading(true);
      let latitude: number | null = null;
      let longitude: number | null = null;

      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        });
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      } catch (err) {
        console.warn("Geolocation failed:", err);
        // We still allow capture even if location fails, but record error state if needed
      }

      const data: CaptureData = {
        image: imageData,
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
        device: navigator.userAgent.split(')').shift()?.split('(').pop() || navigator.userAgent
      };

      setCapturedData(data);
      onCapture(data);
      setLocationLoading(false);
    }
  };

  const retake = () => {
    setCapturedData(null);
    onClear();
    startCamera();
  };

  // Cleanup
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  // -------------------------------------------------------------------
  // RENDER SUB-COMPONENTS
  // -------------------------------------------------------------------
  
  if (capturedData) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="relative aspect-video rounded-3xl overflow-hidden border-none shadow-2xl bg-slate-100">
          <img src={capturedData.image} className="w-full h-full object-cover" alt="Captured" />
          <div className="absolute top-4 right-4 bg-emerald-500 text-white p-2 rounded-full shadow-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MetadataItem 
            icon={MapPin} 
            label="Location" 
            value={capturedData.latitude ? `${capturedData.latitude.toFixed(4)}, ${capturedData.longitude?.toFixed(4)}` : "Unavailable"} 
            status={capturedData.latitude ? "success" : "warning"}
          />
          <MetadataItem 
            icon={Clock} 
            label="Timestamp" 
            value={new Date(capturedData.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} 
          />
          <MetadataItem 
            icon={Smartphone} 
            label="Verified Device" 
            value={capturedData.device} 
          />
        </div>

        <Button 
          type="button" 
          variant="outline" 
          onClick={retake}
          className="w-full h-14 rounded-2xl border-slate-200 font-black text-slate-800 gap-2 hover:bg-slate-50 shadow-sm"
        >
          <RotateCcw className="w-4 h-4" /> Retake Image
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative aspect-video rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden group">
        {isCapturing ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute inset-0 border-[16px] border-white/10 pointer-events-none" />
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center p-8">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm">
              {error ? <AlertCircle className="w-8 h-8 text-rose-500" /> : <Camera className="w-8 h-8" />}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black text-slate-900 uppercase tracking-widest">
                {error || "Field Verification"}
              </p>
              <p className="text-[11px] text-slate-500 font-medium max-w-[200px]">
                {error ? "Please enable camera & location services." : "Capture a real-time photo of your crop to proceed."}
              </p>
            </div>
            {!isCapturing && (
              <Button 
                type="button" 
                onClick={startCamera}
                className="mt-2 rounded-xl bg-slate-900 font-bold px-6 h-11"
              >
                Access Camera
              </Button>
            )}
          </div>
        )}
      </div>

      {isCapturing && (
        <Button 
          type="button" 
          onClick={captureImage}
          disabled={locationLoading}
          className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-black text-lg shadow-xl gap-3 transition-all active:scale-[0.98]"
        >
          <Camera className="w-6 h-6" />
          {locationLoading ? "Securing Metadata..." : "Capture Verified Photo"}
        </Button>
      )}
    </div>
  );
}

function MetadataItem({ icon: Icon, label, value, status }: { icon: any, label: string, value: string, status?: "success" | "warning" }) {
  return (
    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
      <div className={cn(
        "w-9 h-9 rounded-xl flex items-center justify-center",
        status === "warning" ? "bg-amber-50 text-amber-600" : "bg-white text-slate-600 shadow-sm"
      )}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-sm font-bold text-slate-800 truncate">{value}</p>
      </div>
    </div>
  );
}
