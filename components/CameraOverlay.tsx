
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { LatLng, User } from '../types';
import { analyzeSnap } from '../services/geminiService';

interface CameraOverlayProps {
  onClose: () => void;
  onSend: (imageUrl: string, lat: number, lng: number, caption: string) => void;
  userLocation: LatLng | null;
}

const CameraOverlay: React.FC<CameraOverlayProps> = ({ onClose, onSend, userLocation }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' },
          audio: false 
        });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        setError("Kan geen toegang krijgen tot de camera. Controleer je instellingen.");
      }
    };
    startCamera();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(dataUrl);
      }
    }
  };

  const handleSend = async () => {
    if (capturedImage && userLocation) {
      setIsAnalyzing(true);
      const base64Data = capturedImage.split(',')[1];
      const caption = await analyzeSnap(base64Data);
      onSend(capturedImage, userLocation.lat, userLocation.lng, caption);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center p-4">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 z-10"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {error ? (
        <div className="text-center text-white p-8">
          <p className="mb-4">{error}</p>
          <button onClick={onClose} className="bg-blue-600 px-6 py-2 rounded-xl">Ga Terug</button>
        </div>
      ) : (
        <div className="relative w-full max-w-lg aspect-[3/4] rounded-3xl overflow-hidden bg-slate-900 shadow-2xl">
          {!capturedImage ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
          ) : (
            <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
          )}

          <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8">
            {!capturedImage ? (
              <button 
                onClick={takePhoto}
                className="w-20 h-20 bg-white rounded-full border-8 border-white/30 flex items-center justify-center hover:scale-105 transition-transform"
              >
                <div className="w-14 h-14 bg-white rounded-full border-2 border-slate-900 shadow-inner" />
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setCapturedImage(null)}
                  className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white hover:bg-white/30"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button 
                  disabled={isAnalyzing}
                  onClick={handleSend}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 flex items-center gap-3 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Versturen...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Verstuur naar Wereld
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
      
      <canvas ref={canvasRef} className="hidden" />
      
      {!capturedImage && !error && (
        <p className="text-white/60 mt-6 font-medium animate-pulse">Kijk om je heen en leg het moment vast</p>
      )}
    </div>
  );
};

export default CameraOverlay;
