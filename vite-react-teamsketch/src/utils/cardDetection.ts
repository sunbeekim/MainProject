export const detectCard = (video: HTMLVideoElement, canvas: HTMLCanvasElement): boolean => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    // 비디오 프레임을 캔버스에 그립니다
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // 카드 비율 설정
    const cardRatio = 53.98 / 85.6;
    const frameWidth = Math.floor(canvas.width * 0.85);
    const frameHeight = Math.floor(frameWidth * cardRatio);
    const frameX = Math.floor((canvas.width - frameWidth) / 2);
    const frameY = Math.floor((canvas.height - frameHeight) / 2);

    // 1. 엣지 감지 임계값 감소
    const edgePoints = detectEdges(data, canvas.width, canvas.height, 30); // 임계값 30으로 감소
    
    // 2. 프레임 영역 내의 엣지 포인트 수 계산
    const pointsInFrame = countPointsInFrame(edgePoints, frameX, frameY, frameWidth, frameHeight);
    
    // 3. 일치도 계산 시 가중치 적용
    const totalPixels = frameWidth * frameHeight;
    const matchPercentage = (pointsInFrame / totalPixels) * 100;
    
    // 4. 카드 형태 검증 (임계값 완화)
    const hasCardShape = verifyCardShape(edgePoints, frameX, frameY, frameWidth, frameHeight);
    
    // 5. 최종 판단 조건 완화
    return matchPercentage >= 25 && hasCardShape; // 일치도 임계값 25%로 감소
};

// 엣지 검출 함수 개선
function detectEdges(imageData: Uint8ClampedArray, width: number, height: number, threshold: number): boolean[][] {
    const edges: boolean[][] = Array(height).fill(null).map(() => Array(width).fill(false));

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const idx = (y * width + x) * 4;
            
            // 그레이스케일 값 계산
            const gray = (imageData[idx] + imageData[idx + 1] + imageData[idx + 2]) / 3;
            
            // 주변 픽셀과의 차이 계산 (대각선 방향도 고려)
            const diff = Math.max(
                Math.abs(gray - ((imageData[idx - 4] + imageData[idx + 4]) / 2)),
                Math.abs(gray - ((imageData[idx - width * 4] + imageData[idx + width * 4]) / 2)),
                Math.abs(gray - ((imageData[idx - (width + 1) * 4] + imageData[idx + (width + 1) * 4]) / 2)),
                Math.abs(gray - ((imageData[idx - (width - 1) * 4] + imageData[idx + (width - 1) * 4]) / 2))
            );

            edges[y][x] = diff > threshold;
        }
    }
    
    return edges;
}

// 프레임 영역 내의 엣지 포인트 수 계산 함수 개선
function countPointsInFrame(
    edges: boolean[][],
    frameX: number,
    frameY: number,
    frameWidth: number,
    frameHeight: number
): number {
    let count = 0;
    const tolerance = 20; // 프레임 경계 허용 오차 증가

    // 범위 확인 및 조정
    const startY = Math.max(0, Math.floor(frameY - tolerance));
    const endY = Math.min(edges.length, Math.floor(frameY + frameHeight + tolerance));
    const startX = Math.max(0, Math.floor(frameX - tolerance));
    const endX = Math.min(edges[0].length, Math.floor(frameX + frameWidth + tolerance));

    for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
            if (edges[y][x]) {
                count++;
            }
        }
    }

    return count;
}

// 카드 형태 검증 함수 개선
function verifyCardShape(edges: boolean[][], frameX: number, frameY: number, 
    frameWidth: number, frameHeight: number): boolean {
    
    // 모서리 영역 검사 (임계값 완화)
    const cornerSize = 30; // 모서리 검사 영역 증가
    const corners = [
        { x: frameX, y: frameY }, // 좌상단
        { x: frameX + frameWidth, y: frameY }, // 우상단
        { x: frameX, y: frameY + frameHeight }, // 좌하단
        { x: frameX + frameWidth, y: frameY + frameHeight } // 우하단
    ];

    // 각 모서리에서 엣지 포인트 검사 (임계값 완화)
    for (const corner of corners) {
        let edgeCount = 0;
        for (let y = corner.y - cornerSize; y <= corner.y + cornerSize; y++) {
            for (let x = corner.x - cornerSize; x <= corner.x + cornerSize; x++) {
                if (y >= 0 && y < edges.length && x >= 0 && x < edges[0].length) {
                    if (edges[y][x]) edgeCount++;
                }
            }
        }
        // 모서리 영역에 충분한 엣지 포인트가 없으면 false 반환 (임계값 완화)
        if (edgeCount < 30) return false; // 50에서 30으로 감소
    }

    // 직선 검출 (임계값 완화)
    const lines = detectLines(edges, frameX, frameY, frameWidth, frameHeight);
    
    // 최소 3개의 직선이 필요 (카드의 4변 중 3변만 있어도 인정)
    return lines.length >= 3;
}

// 직선 검출 보조 함수 개선
function detectLines(edges: boolean[][], frameX: number, frameY: number, 
    frameWidth: number, frameHeight: number): Array<{x1: number, y1: number, x2: number, y2: number}> {
    
    const lines: Array<{x1: number, y1: number, x2: number, y2: number}> = [];
    const minLineLength = 30; // 최소 직선 길이 감소

    // 수평선 검출
    for (let y = frameY; y < frameY + frameHeight; y++) {
        let startX = -1;
        let consecutive = 0;
        
        for (let x = frameX; x < frameX + frameWidth; x++) {
            if (edges[y][x]) {
                if (startX === -1) startX = x;
                consecutive++;
            } else {
                if (consecutive >= minLineLength) {
                    lines.push({
                        x1: startX,
                        y1: y,
                        x2: x - 1,
                        y2: y
                    });
                }
                startX = -1;
                consecutive = 0;
            }
        }
    }

    // 수직선 검출
    for (let x = frameX; x < frameX + frameWidth; x++) {
        let startY = -1;
        let consecutive = 0;
        
        for (let y = frameY; y < frameY + frameHeight; y++) {
            if (edges[y][x]) {
                if (startY === -1) startY = y;
                consecutive++;
            } else {
                if (consecutive >= minLineLength) {
                    lines.push({
                        x1: x,
                        y1: startY,
                        x2: x,
                        y2: y - 1
                    });
                }
                startY = -1;
                consecutive = 0;
            }
        }
    }

    return lines;
}
