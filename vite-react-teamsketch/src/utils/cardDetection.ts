export const detectCard = (video: HTMLVideoElement, canvas: HTMLCanvasElement): boolean => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    // 비디오 프레임을 캔버스에 그립니다
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // 프레임 영역 계산 (CardFrame 컴포넌트의 크기와 동일하게)
    const frameWidth = canvas.width * 0.85;  // 85vw
    const frameHeight = frameWidth * (53/85); // 카드 비율
    const frameX = (canvas.width - frameWidth) / 2;
    const frameY = (canvas.height - frameHeight) / 2;

    // 프레임 영역의 엣지 검출
    const edgePoints = detectEdges(data, canvas.width, canvas.height);
    
    // 프레임 영역 내의 엣지 포인트 수 계산
    const pointsInFrame = countPointsInFrame(edgePoints, frameX, frameY, frameWidth, frameHeight);
    
    // 프레임과의 일치도 계산 (85% 이상이면 카드로 인식)
    const matchPercentage = pointsInFrame / (frameWidth * frameHeight) * 100;
    
    return matchPercentage >= 85;
};

// 엣지 검출 함수
function detectEdges(imageData: Uint8ClampedArray, width: number, height: number): boolean[][] {
    const edges: boolean[][] = Array(height).fill(false).map(() => Array(width).fill(false));
    const threshold = 30; // 엣지 감지 임계값

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const idx = (y * width + x) * 4;
            
            // 소벨 엣지 검출
            const gx = 
                -1 * imageData[idx - 4 - width * 4] +
                1 * imageData[idx + 4 - width * 4] +
                -2 * imageData[idx - 4] +
                2 * imageData[idx + 4] +
                -1 * imageData[idx - 4 + width * 4] +
                1 * imageData[idx + 4 + width * 4];

            const gy = 
                -1 * imageData[idx - 4 - width * 4] +
                -2 * imageData[idx - width * 4] +
                -1 * imageData[idx + 4 - width * 4] +
                1 * imageData[idx - 4 + width * 4] +
                2 * imageData[idx + width * 4] +
                1 * imageData[idx + 4 + width * 4];

            const magnitude = Math.sqrt(gx * gx + gy * gy);
            edges[y][x] = magnitude > threshold;
        }
    }
    
    return edges;
}

// 프레임 영역 내의 엣지 포인트 수 계산
function countPointsInFrame(
    edges: boolean[][],
    frameX: number,
    frameY: number,
    frameWidth: number,
    frameHeight: number
): number {
    let count = 0;
    const tolerance = 5; // 프레임 경계 허용 오차

    for (let y = frameY - tolerance; y < frameY + frameHeight + tolerance; y++) {
        for (let x = frameX - tolerance; x < frameX + frameWidth + tolerance; x++) {
            if (y >= 0 && y < edges.length && x >= 0 && x < edges[0].length) {
                if (edges[y][x]) {
                    count++;
                }
            }
        }
    }

    return count;
}
