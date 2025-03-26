import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { loadOpenCV, detectCard, resetOpenCV } from '../../../utils/cardDetection';
import CardFrame from './CardFrame';

interface CameraModalProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onCapture: () => void;
  onClose: () => void;
  onError: (message: string) => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ videoRef, onCapture, onClose, onError }) => {
  const [loading, setLoading] = useState(true);
  const [cardDetected, setCardDetected] = useState(false);
  const [opencvLoaded, setOpencvLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const captureButtonRef = useRef<HTMLButtonElement>(null);
  const captureEnabled = useRef<boolean>(true);

  // OpenCV 로드 및 카메라 초기화
  useEffect(() => {
    let isMounted = true;
    
    const initCamera = async () => {
      try {
        console.log('카메라 초기화 시작 - CameraModal');
        setLoading(true);
        
        // 이미 스트림이 있다면 정리
        if (streamRef.current) {
          console.log('기존 스트림 정리 후 재시작');
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        
        // OpenCV 로드
        try {
          console.log('OpenCV 로드 시도...');
          const opencvLoaded = await loadOpenCV(progress => {
            // 로딩 진행 상태를 콘솔에 출력
            console.log(`OpenCV 로딩 진행 상태: ${progress}%`);
          });
          
          if (!isMounted) return;
          
          if (opencvLoaded) {
            console.log('OpenCV 로드 성공');
            setOpencvLoaded(true);
          } else {
            console.error('OpenCV 로드 실패: 알 수 없는 오류');
            onError('OpenCV 로드 실패: 알 수 없는 오류가 발생했습니다.');
            setLoading(false);
            return;
          }
        } catch (opencvError) {
          if (!isMounted) return;
          console.error('OpenCV 로드 중 오류 발생:', opencvError);
          onError(`OpenCV 로드 실패: ${opencvError instanceof Error ? opencvError.message : '알 수 없는 오류'}`);
          setLoading(false);
          return;
        }

        // 카메라 스트림 가져오기
        const constraints = {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'environment'
          }
        };

        try {
          console.log('카메라 스트림 요청 중...');
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          
          if (!isMounted) {
            // 컴포넌트가 언마운트되었다면 스트림 정리
            stream.getTracks().forEach(track => track.stop());
            return;
          }

          streamRef.current = stream;
          console.log('카메라 스트림 획득 성공');
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play()
              .then(() => {
                console.log('비디오 재생 시작');
                setLoading(false);
                captureEnabled.current = true;
              })
              .catch(err => {
                console.error('비디오 재생 실패:', err);
                onError('카메라 스트림을 재생할 수 없습니다. 브라우저 설정을 확인해주세요.');
                setLoading(false);
              });
          } else {
            console.error('비디오 요소를 찾을 수 없음');
            onError('카메라를 초기화할 수 없습니다. 페이지를 새로고침해 주세요.');
            setLoading(false);
          }
        } catch (streamError) {
          if (!isMounted) return;
          console.error('카메라 스트림 획득 실패:', streamError);
          onError('카메라에 접근할 수 없습니다. 카메라 권한을 확인해주세요.');
          setLoading(false);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('카메라 초기화 오류:', error);
        const errorMessage = error instanceof Error
          ? error.message
          : '카메라를 초기화하는 중 오류가 발생했습니다.';
        onError(errorMessage);
        setLoading(false);
      }
    };

    initCamera();

    // 컴포넌트 언마운트 시 정리
    return () => {
      isMounted = false;
      // 카메라 스트림 정리
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log(`트랙 정리: ${track.kind}`);
        });
        streamRef.current = null;
      }
      
      // 비디오 요소 정리
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        console.log('비디오 소스 제거됨 - CameraModal 언마운트');
      }
      
      // OpenCV 리셋
      resetOpenCV();
      console.log('CameraModal 언마운트 - 모든 리소스 정리');
    };
  }, [videoRef, onError]);

  // 카드 감지 로직
  useEffect(() => {
    let animationFrameId: number;
    let lastDetectionTime = 0;
    const DETECTION_INTERVAL = 500; // 0.5초마다 감지 실행
    
    const detectCardInFrame = async () => {
      if (!videoRef.current || !canvasRef.current || !opencvLoaded || loading) {
        animationFrameId = requestAnimationFrame(detectCardInFrame);
        return;
      }

      const now = Date.now();
      if (now - lastDetectionTime > DETECTION_INTERVAL) {
        lastDetectionTime = now;
        
        try {
          // 카드 감지 실행
          const result = await detectCard(
            videoRef.current,
            canvasRef.current
          );
          
          setCardDetected(result.isDetected);
        } catch (error) {
          console.error('카드 감지 오류:', error);
          // 감지 오류는 치명적이지 않으므로 계속 시도
        }
      }
      
      animationFrameId = requestAnimationFrame(detectCardInFrame);
    };

    if (opencvLoaded && !loading) {
      animationFrameId = requestAnimationFrame(detectCardInFrame);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [opencvLoaded, loading]);

  // 키보드 Esc 키 이벤트 처리
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const handleCapture = () => {
    if (!captureEnabled.current) {
      console.log('캡처 버튼 비활성화 상태');
      return;
    }
    
    // 중복 클릭 방지
    captureEnabled.current = false;
    
    // 캡처 실행
    onCapture();
    
    // 모달 닫기
    handleClose();
  };

  const handleClose = () => {
    // OpenCV 리셋
    resetOpenCV();
    setOpencvLoaded(false);
    
    // 모달 닫기
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* 상단 버튼 영역 */}
      <div className="relative flex justify-between items-center p-4">
        <button
          onClick={handleClose}
          className="text-white bg-black/30 p-2 rounded-full"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* 카메라 영역 */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
        
        {/* 로딩 상태 */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
            <svg className="animate-spin h-10 w-10 mb-2" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p>카메라 초기화 중...</p>
          </div>
        )}       

        <CardFrame 
          isDetected={cardDetected}
          isLoading={loading}
          detectionStatus={cardDetected ? '카드가 감지되었습니다!' : '카드를 프레임 안에 맞춰주세요'}
        />
      </div>
      
      {/* 하단 촬영 버튼 영역 */}
      <div className="p-6 flex justify-center">
        <button
          ref={captureButtonRef}
          onClick={handleCapture}
          disabled={loading}
          className={`
            w-16 h-16 rounded-full flex items-center justify-center
            ${cardDetected ? 'bg-green-500' : 'bg-white'}
            ${loading ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
            transition-all duration-300
          `}
        >
          <div className="w-14 h-14 rounded-full border-4 border-black" />
        </button>
      </div>
    </div>,
    document.body
  );
};

export default CameraModal;
