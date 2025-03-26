// OpenCV.js 동적 로딩
let cv: any = null;
let isOpenCVLoaded = false;
let loadPromise: Promise<boolean> | null = null;

/**
 * OpenCV 초기화 상태를 리셋하는 함수
 * 재사용 문제를 해결하기 위해 호출됨
 */
export const resetOpenCV = () => {
  // OpenCV 스크립트 완전 제거
  const existingScript = document.querySelector('script[src*="opencv.js"]');
  if (existingScript) {
    existingScript.remove();
    console.log('OpenCV 스크립트 요소가 제거되었습니다.');
  }
  
  // window.cv 참조 제거
  if (window && 'cv' in window) {
    try {
      // TypeScript에서는 window.cv가 알려진 속성이 아니므로 any 타입으로 처리
      (window as any).cv = undefined;
      console.log('window.cv 참조가 제거되었습니다.');
    } catch (error) {
      console.error('window.cv 참조 제거 실패:', error);
    }
  }
  
  // 모듈 상태 초기화
  cv = null;
  isOpenCVLoaded = false;
  loadPromise = null;
  
  // 메모리 정리 요청
  if (typeof (window as any).gc === 'function') {
    try {
      (window as any).gc();
    } catch {
      console.log('가비지 컬렉션 요청 실패 - 무시됨');
    }
  }
  
  console.log('OpenCV 상태가 완전히 리셋되었습니다.');
};

export const loadOpenCV = async (onProgress?: (progress: number) => void): Promise<boolean> => {
  // 이미 로드된 경우 바로 반환
  if (isOpenCVLoaded && cv) {
    console.log('OpenCV.js가 이미 로드되어 있습니다.');
    onProgress?.(100);
    return true;
  }

  // 진행 중인 로드 요청이 있는 경우 해당 Promise 반환
  if (loadPromise) {
    console.log('OpenCV.js 로딩이 이미 진행 중입니다.');
    return loadPromise;
  }

  // 이전 스크립트 또는 인스턴스가 있는 경우 정리
  if ('cv' in window) {
    console.log('이전 OpenCV 인스턴스 정리 중...');
    resetOpenCV();
  }

  loadPromise = new Promise((resolve, reject) => {
    try {
      console.log('OpenCV.js 로딩 시작...');
      onProgress?.(0);
      
      // 로컬 파일 사용 (CORS 문제 해결)
      const script = document.createElement('script');
      script.src = '/lib/opencv.js'; // public 폴더의 lib 디렉토리에 있는 파일
      script.async = true;
      
      script.onload = () => {
        console.log('OpenCV.js 스크립트 로드 완료');
        onProgress?.(50);
        
        // window.cv 참조 획득
        cv = (window as any).cv;
        
        if (!cv) {
          const error = new Error('OpenCV.js가 window.cv를 생성하지 않았습니다.');
          console.error(error);
          onProgress?.(0);
          reject(error);
          return;
        }
        
        // OpenCV.js 초기화 완료 대기
        if (cv.isReady) {
          isOpenCVLoaded = true;
          console.log('OpenCV.js 초기화 완료 (isReady)');
          onProgress?.(100);
          resolve(true);
        } else {
          console.log('OpenCV.js 초기화 대기 중... (onRuntimeInitialized 이벤트를 기다리는 중)');
          onProgress?.(75);
          
          cv.onRuntimeInitialized = () => {
            isOpenCVLoaded = true;
            console.log('OpenCV.js 초기화 완료 (onRuntimeInitialized)');
            onProgress?.(100);
            resolve(true);
          };
          
          // 20초 후에도 초기화가 완료되지 않으면 타임아웃 처리
          setTimeout(() => {
            if (!isOpenCVLoaded) {
              const timeoutError = new Error('OpenCV.js 초기화 타임아웃 (20초 초과)');
              console.error(timeoutError);
              onProgress?.(0);
              reject(timeoutError);
            }
          }, 20000); // 20초로 타임아웃 증가
        }
      };

      script.onerror = (error) => {
        console.error('OpenCV.js 스크립트 로드 실패:', error);
        onProgress?.(0);
        reject(error);
      };

      document.head.appendChild(script);
    } catch (error) {
      console.error('OpenCV.js 로딩 중 오류 발생:', error);
      onProgress?.(0);
      reject(error);
    }
  });

  try {
    await loadPromise;
    return true;
  } catch (error) {
    loadPromise = null;
    throw error;
  }
};

// 카드 비율 상수 (신용카드 표준 비율)
const CARD_RATIO = 53.98 / 85.6;

/**
 * 카드 감지 함수
 * @param video 비디오 엘리먼트
 * @param canvas 캔버스 엘리먼트
 * @returns 카드가 감지되었는지 여부와 상태 메시지
 */
export async function detectCard(
  video: HTMLVideoElement, 
  canvas: HTMLCanvasElement
): Promise<{ isDetected: boolean; status: string }> {
  // 이 함수에서 사용할 OpenCV 객체들 선언
  let src: any = null;
  let gray: any = null;
  let blurred: any = null;
  let edges: any = null;
  let contours: any = null;
  let hierarchy: any = null;
  let cnt: any = null;
  let approx: any = null;

  try {
    // OpenCV가 초기화되지 않은 경우 로드 시도
    if (!isOpenCVLoaded || !cv) {
      console.log('OpenCV 초기화되지 않음, 로딩 시도...');
      await loadOpenCV();
    }

    // OpenCV 객체 확인
    if (!cv) {
      return { isDetected: false, status: 'OpenCV 라이브러리를 사용할 수 없습니다' };
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('캔버스 컨텍스트를 가져올 수 없습니다.');
      return { isDetected: false, status: '캔버스 초기화 실패' };
    }

    // 비디오 상태 확인
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      return { isDetected: false, status: '비디오 스트림이 준비되지 않았습니다' };
    }

    // 캔버스 크기 설정
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 비디오 프레임을 캔버스에 그리기
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // OpenCV.js 객체 생성
    src = cv.imread(canvas);
    gray = new cv.Mat();
    blurred = new cv.Mat();
    edges = new cv.Mat();
    contours = new cv.MatVector();
    hierarchy = new cv.Mat();

    // 이미지 전처리
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);
    cv.Canny(blurred, edges, 75, 150);

    // 윤곽선 찾기
    cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    // 윤곽선 분석
    let cardDetected = false;
    for (let i = 0; i < contours.size(); i++) {
      // 이미 카드가 감지된 경우 루프 중단
      if (cardDetected) break;
      
      cnt = contours.get(i);
      approx = new cv.Mat();
      
      // 윤곽선 근사화
      cv.approxPolyDP(cnt, approx, 0.02 * cv.arcLength(cnt, true), true);
      
      // 4개의 꼭지점을 가진 윤곽선 확인 (카드 모양)
      if (approx.rows === 4) {
        const rect = cv.boundingRect(approx);
        const ratio = rect.height / rect.width;
        
        // 카드 비율과 유사한지 확인 (20% 오차 허용)
        if (Math.abs(ratio - CARD_RATIO) < 0.2) {
          cardDetected = true;
        }
      }
      
      // 현재 윤곽선 객체 해제
      if (approx) approx.delete();
      if (cnt) cnt.delete();
      
      // 다음 윤곽선을 위해 참조 초기화
      approx = null;
      cnt = null;
    }

    return { 
      isDetected: cardDetected, 
      status: cardDetected ? '카드가 감지되었습니다!' : '카드를 찾을 수 없습니다' 
    };
  } catch (error) {
    console.error('카드 감지 중 오류 발생:', error);
    return { isDetected: false, status: '감지 중 오류가 발생했습니다' };
  } finally {
    // 모든 OpenCV 자원 해제
    try {
      if (src) src.delete();
      if (gray) gray.delete();
      if (blurred) blurred.delete();
      if (edges) edges.delete();
      if (contours) contours.delete();
      if (hierarchy) hierarchy.delete();
      if (approx) approx.delete();
      if (cnt) cnt.delete();
    } catch (cleanupError) {
      console.error('OpenCV 자원 정리 중 오류:', cleanupError);
    }
  }
}