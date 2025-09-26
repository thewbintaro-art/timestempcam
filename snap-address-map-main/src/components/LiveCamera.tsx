import React, { useRef, useEffect, useState } from 'react';
import { Camera, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LiveCameraProps {
  onCapture: (imageDataUrl: string) => void;
  isCapturing: boolean;
}

const LiveCamera: React.FC<LiveCameraProps> = ({ onCapture, isCapturing }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const startCamera = async (facing: 'user' | 'environment' = 'environment') => {
    try {
      setError('');
      
      // Stop existing stream if any
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data URL
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    onCapture(imageDataUrl);
  };

  const switchCamera = () => {
    const newFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newFacing);
    startCamera(newFacing);
  };

  useEffect(() => {
    startCamera(facingMode);

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  if (error) {
    return (
      <div className="text-center p-8">
        <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => startCamera(facingMode)} variant="outline">
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-lg bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-64 md:h-80 object-cover"
        />
        
        {/* Camera controls overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <Button
            onClick={switchCamera}
            variant="secondary"
            size="icon"
            className="bg-black/50 hover:bg-black/70 text-white border-white/20"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={capturePhoto}
            disabled={isCapturing}
            size="lg"
            className="bg-white text-black hover:bg-white/90 font-semibold px-8"
          >
            {isCapturing ? (
              <>
                <Camera className="mr-2 h-5 w-5 animate-pulse" />
                Memproses...
              </>
            ) : (
              <>
                <Camera className="mr-2 h-5 w-5" />
                Ambil Foto
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Hidden canvas for capturing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default LiveCamera;