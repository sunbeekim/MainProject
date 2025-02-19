FROM python:3.9-slim

WORKDIR /app

# 시스템 패키지 및 Python 패키지 설치
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
    sentencepiece

COPY . .

EXPOSE 8001

ENV PORT=8001
CMD ["uvicorn", "llamaServer:app", "--host", "0.0.0.0", "--port", "8001"] 