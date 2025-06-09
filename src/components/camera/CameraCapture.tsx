
import { useRef, useState, useEffect } from 'react';
import { Camera, RotateCcw, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraCaptureProps {
  onCapture: (imageFile: File) => void;
  onClose: () => void;
}

const CameraCapture = ({ onCapture, onClose }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions.');
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageDataUrl);
      stopCamera();
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmPhoto = () => {
    if (!capturedImage) return;
    
    // Convert data URL to File
    fetch(capturedImage)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'tree-photo.jpg', { type: 'image/jpeg' });
        onCapture(file);
      });
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <Camera className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Camera Access Required</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={onClose} variant="outline">
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black">
      {/* Camera View */}
      {!capturedImage && (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="text-white text-center">
                <Camera className="h-8 w-8 animate-pulse mx-auto mb-2" />
                <p>Starting camera...</p>
              </div>
            </div>
          )}

          {/* Camera Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
            <div className="flex items-center justify-between">
              <Button
                onClick={onClose}
                variant="outline"
                size="icon"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <X className="h-5 w-5" />
              </Button>

              <Button
                onClick={capturePhoto}
                size="lg"
                className="w-16 h-16 rounded-full bg-white border-4 border-white/50 hover:bg-gray-100"
                disabled={isLoading}
              >
                <Camera className="h-8 w-8 text-black" />
              </Button>

              <Button
                onClick={switchCamera}
                variant="outline"
                size="icon"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Preview captured image */}
      {capturedImage && (
        <>
          <img
            src={capturedImage}
            alt="Captured tree"
            className="w-full h-full object-cover"
          />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={retakePhoto}
                variant="outline"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Retake
              </Button>

              <Button
                onClick={confirmPhoto}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="h-5 w-5 mr-2" />
                Use Photo
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
