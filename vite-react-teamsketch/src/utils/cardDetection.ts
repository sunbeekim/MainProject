// OpenCV.js 동적 로딩
let cv: any = null;

const loadOpenCV = async () => {
  if (!cv) {
    try {
      console.log('OpenCV.js 로딩 시작...');
      // OpenCV.js 스크립트 동적 로드
      const script = document.createElement('script');
      script.src = 'https://docs.opencv.org/4.8.0/opencv.js';
      script.async = true;
      
      await new Promise((resolve, reject) => {
        script.onload = () => {
          console.log('OpenCV.js 스크립트 로드 완료');
          // @ts-expect-error OpenCV.js는 window 객체에 cv 속성을 동적으로 추가합니다
          cv = window.cv;
          console.log('OpenCV.js 초기화 완료');
          resolve(cv);
        };
        script.onerror = (error) => {
          console.error('OpenCV.js 스크립트 로드 실패:', error);
          reject(error);
        };
        document.head.appendChild(script);
      });
    } catch (error) {
      console.error('OpenCV.js 로딩 중 오류 발생:', error);
      throw error;
    }
  }
  return cv;
};

// 카드 비율 상수 (신용카드 표준 비율)
const CARD_RATIO = 53.98 / 85.6;

/**
 * 카드 감지 함수
 * @param video 비디오 엘리먼트
 * @param canvas 캔버스 엘리먼트
 * @returns 카드가 감지되었는지 여부
 */
export async function detectCard(video: HTMLVideoElement, canvas: HTMLCanvasElement): Promise<boolean> {
  try {
    console.log('카드 감지 시작...');
    const cv = await loadOpenCV();
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('캔버스 컨텍스트를 가져올 수 없습니다.');
      return false;
    }

    // 비디오 프레임을 캔버스에 그리기
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    console.log('비디오 프레임 캡처 완료');
    
    // OpenCV.js 객체 생성
    console.log('OpenCV 객체 생성 중...');
    const src = cv.imread(canvas);
    const gray = new cv.Mat();
    const blurred = new cv.Mat();
    const edges = new cv.Mat();
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();

    try {
      // 이미지 전처리
      console.log('이미지 전처리 시작...');
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
      cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);
      cv.Canny(blurred, edges, 75, 150);
      console.log('이미지 전처리 완료');

      // 윤곽선 찾기
      console.log('윤곽선 검출 시작...');
      cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
      console.log(`발견된 윤곽선 수: ${contours.size()}`);

      // 윤곽선 분석
      for (let i = 0; i < contours.size(); i++) {
        const cnt = contours.get(i);
        const approx = new cv.Mat();
        
        // 윤곽선 근사화
        cv.approxPolyDP(cnt, approx, 0.02 * cv.arcLength(cnt, true), true);
        
        // 4개의 꼭지점을 가진 윤곽선 확인 (카드 모양)
        if (approx.rows === 4) {
          const rect = cv.boundingRect(approx);
          const ratio = rect.height / rect.width;
          
          // 카드 비율과 유사한지 확인 (20% 오차 허용)
          if (Math.abs(ratio - CARD_RATIO) < 0.2) {
            console.log('카드 감지 성공!');
            // 메모리 해제
            src.delete();
            gray.delete();
            blurred.delete();
            edges.delete();
            contours.delete();
            hierarchy.delete();
            approx.delete();
            cnt.delete();
            
            return true;
          }
        }
        
        approx.delete();
        cnt.delete();
      }

      console.log('카드 감지 실패');
      return false;
    } catch (error) {
      console.error('카드 감지 중 오류 발생:', error);
      return false;
    } finally {
      // 메모리 해제
      console.log('메모리 정리 중...');
      src.delete();
      gray.delete();
      blurred.delete();
      edges.delete();
      contours.delete();
      hierarchy.delete();
      console.log('메모리 정리 완료');
    }
  } catch (error) {
    console.error('OpenCV.js 로딩 중 오류 발생:', error);
    return false;
  }
}