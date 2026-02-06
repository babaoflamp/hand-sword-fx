import { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker, HandLandmarkerResult } from '@mediapipe/tasks-vision';

interface HandTrackerProps {
  onHandsDetected: (result: HandLandmarkerResult) => void;
}

export const HandTracker = ({ onHandsDetected }: HandTrackerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let handLandmarker: HandLandmarker | null = null;
    let animationFrameId: number;

    const setupMediaPipe = async () => {
      console.log("Setting up MediaPipe...");
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm"
        );
        
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });
        
        console.log("MediaPipe Loaded!");
        setIsLoaded(true);
        startWebcam();
      } catch (error) {
        console.error("Error initializing MediaPipe:", error);
      }
    };

    const startWebcam = async () => {
        if (!videoRef.current) return;
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 640, height: 480 } 
            });
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
                console.log("Webcam metadata loaded");
                videoRef.current?.play();
                predictWebcam();
            };
        } catch (err) {
            console.error("Error accessing webcam:", err);
        }
    };

    const predictWebcam = () => {
        if (!handLandmarker || !videoRef.current || !canvasRef.current) return;
        
        const startTimeMs = performance.now();
        if (videoRef.current.readyState >= 2) { // HAVE_CURRENT_DATA
            const result = handLandmarker.detectForVideo(videoRef.current, startTimeMs);
            onHandsDetected(result);

            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                if (result.landmarks && result.landmarks.length > 0) {
                    ctx.fillStyle = "#00FF00";
                    for (const landmark of result.landmarks[0]) {
                        ctx.beginPath();
                        ctx.arc(landmark.x * canvasRef.current.width, landmark.y * canvasRef.current.height, 3, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                }
            }
        }
        animationFrameId = requestAnimationFrame(predictWebcam);
    };

    setupMediaPipe();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (handLandmarker) {
          handLandmarker.close();
      }
      if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div id="video-container" style={{ position: 'absolute', top: 10, left: 10, zIndex: 100, background: 'rgba(0,0,0,0.5)', padding: '5px', borderRadius: '10px' }}>
      {!isLoaded && <div style={{ color: 'white', fontSize: '12px' }}>Loading AI...</div>}
      <div style={{ position: 'relative', width: '160px', height: '120px' }}>
        <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            style={{ width: '100%', height: '100%', transform: 'scaleX(-1)', objectFit: 'cover' }} 
        />
        <canvas 
            ref={canvasRef} 
            width="640" 
            height="480" 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'scaleX(-1)', pointerEvents: 'none' }} 
        />
      </div>
    </div>
  );
};