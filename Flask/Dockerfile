FROM python:3.9-slim

WORKDIR /app

# 시스템 패키지 설치
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Python 패키지 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 필요한 패키지 직접 설치
RUN pip install --no-cache-dir \
    transformers \
    torch \
    sentencepiece \
    accelerate>=0.26.0  # accelerate 패키지 추가

# 소스 코드 복사
COPY . .

EXPOSE 8001

CMD ["uvicorn", "llamaServer:app", "--host", "0.0.0.0", "--port", "8001"]
