export const detectCard = (video: HTMLVideoElement, canvas: HTMLCanvasElement): boolean => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    // 비디오 프레임을 캔버스에 그립니다
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // 정확한 신용카드 비율 적용 (85.6mm x 53.98mm)
    const cardRatio = 53.98 / 85.6;
    const frameWidth = Math.floor(canvas.width * 0.85);
    const frameHeight = Math.floor(frameWidth * cardRatio);
    const frameX = Math.floor((canvas.width - frameWidth) / 2);
    const frameY = Math.floor((canvas.height - frameHeight) / 2);

    // 프레임 영역의 엣지 검출
    const edgePoints = detectEdges(data, canvas.width, canvas.height);
    
    // 프레임 영역 내의 엣지 포인트 수 계산
    const pointsInFrame = countPointsInFrame(edgePoints, frameX, frameY, frameWidth, frameHeight);
    
    // 프레임과의 일치도 계산 (25% 이상이면 카드로 인식 - 임계값 낮춤)
    const totalPixels = frameWidth * frameHeight;
    const matchPercentage = (pointsInFrame / totalPixels) * 100;
    
    // 더 자세한 디버깅 정보 출력
    console.log('카드 감지 상태:', {
        캔버스크기: `${canvas.width} x ${canvas.height}`,
        프레임크기: `${frameWidth} x ${frameHeight}`,
        프레임위치: `X: ${frameX}, Y: ${frameY}`,
        감지된엣지수: pointsInFrame,
        전체픽셀수: totalPixels,
        일치율: `${matchPercentage.toFixed(2)}%`,
        촬영가능성: matchPercentage >= 25 ? '촬영 가능' : '정렬 필요',
        임계값: '25%'
    });

    // 임계값을 25%로 낮춤
    return matchPercentage >= 25;
};

// 엣지 검출 함수의 임계값도 조정
function detectEdges(imageData: Uint8ClampedArray, width: number, height: number): boolean[][] {
    const edges: boolean[][] = Array(height).fill(null).map(() => Array(width).fill(false));
    const threshold = 35; // 엣지 감지 임계값 낮춤 (50 -> 35)

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const idx = (y * width + x) * 4;
            
            // 그레이스케일 값 계산
            const gray = (imageData[idx] + imageData[idx + 1] + imageData[idx + 2]) / 3;
            
            // 주변 픽셀과의 차이 계산
            const diff = Math.abs(gray - ((
                imageData[idx - 4] + 
                imageData[idx + 4] + 
                imageData[idx - width * 4] + 
                imageData[idx + width * 4]
            ) / 4));

            edges[y][x] = diff > threshold;
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
    const tolerance = 10; // 프레임 경계 허용 오차 증가

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
