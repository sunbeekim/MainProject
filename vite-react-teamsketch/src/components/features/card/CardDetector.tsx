import React, { useEffect, useRef, useState } from 'react';
import { detectCard } from '../../../utils/cardDetection';

interface CardDetectorProps {
  onDetected: () => void;
}

const CardDetector: React.FC<CardDetectorProps> = ({ onDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCardDetected, setIsCardDetected] = useState(false);

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error('카메라 접근 실패:', err);
      }
    };

    initCamera();
  }, []);

  useEffect(() => {
    const detectLoop = async () => {
      if (videoRef.current && canvasRef.current) {
        const detected = await detectCard(videoRef.current, canvasRef.current);
        setIsCardDetected(detected);
        if (detected) onDetected();
      }
      requestAnimationFrame(detectLoop);
    };
    requestAnimationFrame(detectLoop);
  }, [onDetected]);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <video ref={videoRef} className="w-full rounded" playsInline muted />
      <canvas ref={canvasRef} width={640} height={480} className="hidden" />
      {isCardDetected && (
        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded">
          카드 감지됨
        </div>
      )}
    </div>
  );
};

export default CardDetector; 