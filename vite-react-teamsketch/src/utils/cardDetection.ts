export const detectCard = (video: HTMLVideoElement, canvas: HTMLCanvasElement): boolean => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    // 비디오 프레임을 캔버스에 그립니다
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // 카드의 엣지를 감지하기 위한 임계값
    const threshold = 30;
    const requiredMatches = 0.85; // 85% 일치율

    // 프레임 영역 계산
    const frameWidth = canvas.width * 0.85;  // CardFrame에서 설정한 85vw와 동일
    const frameHeight = frameWidth * (53/85); // 카드 비율
    const frameX = (canvas.width - frameWidth) / 2;
    const frameY = (canvas.height - frameHeight) / 2;

    // 엣지 감지 및 프레임과의 일치도 계산
    const edges = detectEdges(imageData.data, canvas.width, canvas.height, threshold);
    const frameMatch = calculateFrameMatch(edges, frameX, frameY, frameWidth, frameHeight);

    return frameMatch >= requiredMatches;
};

// 엣지 감지 함수
function detectEdges(pixels: Uint8ClampedArray, width: number, height: number, threshold: number): boolean[][] {
    const edges: boolean[][] = Array(height).fill(false).map(() => Array(width).fill(false));
    
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const idx = (y * width + x) * 4;
            
            // 소벨 엣지 감지 적용
            const gx = 
                -1 * pixels[idx - 4 - width * 4] +
                1 * pixels[idx + 4 - width * 4] +
                -2 * pixels[idx - 4] +
                2 * pixels[idx + 4] +
                -1 * pixels[idx - 4 + width * 4] +
                1 * pixels[idx + 4 + width * 4];

            const gy = 
                -1 * pixels[idx - 4 - width * 4] +
                -2 * pixels[idx - width * 4] +
                -1 * pixels[idx + 4 - width * 4] +
                1 * pixels[idx - 4 + width * 4] +
                2 * pixels[idx + width * 4] +
                1 * pixels[idx + 4 + width * 4];

            const magnitude = Math.sqrt(gx * gx + gy * gy);
            edges[y][x] = magnitude > threshold;
        }
    }
    
    return edges;
}

// 프레임 일치도 계산
function calculateFrameMatch(edges: boolean[][], frameX: number, frameY: number, frameWidth: number, frameHeight: number): number {
    let matches = 0;
    let total = 0;
    
    // 프레임 경계선 주변의 엣지 검사
    for (let y = frameY; y < frameY + frameHeight; y++) {
        for (let x = frameX; x < frameX + frameWidth; x++) {
            if (isOnFrameBorder(x, y, frameX, frameY, frameWidth, frameHeight, 5)) {
                total++;
                if (edges[Math.floor(y)][Math.floor(x)]) {
                    matches++;
                }
            }
        }
    }
    
    return matches / total;
}

// 프레임 경계선 주변 여부 확인
function isOnFrameBorder(x: number, y: number, frameX: number, frameY: number, frameWidth: number, frameHeight: number, tolerance: number): boolean {
    const distToLeft = Math.abs(x - frameX);
    const distToRight = Math.abs(x - (frameX + frameWidth));
    const distToTop = Math.abs(y - frameY);
    const distToBottom = Math.abs(y - (frameY + frameHeight));
    
    return (
        (distToLeft <= tolerance || distToRight <= tolerance) ||
        (distToTop <= tolerance || distToBottom <= tolerance)
    );
}
