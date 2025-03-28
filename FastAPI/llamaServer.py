from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
from typing import Dict
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import re
import asyncio
import logging
from datetime import datetime

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler('llama_server.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS 설정
origins = [
    "http://localhost:8080",
    "http://localhost:3000",
    "http://gateway-container:8080",
    "http://core-container:8081",
    "http://assist-container:8082",
    "https://sunbee.world",
    "*"  # 개발 중에는 모든 origin 허용
]

logger.info("CORS 설정 초기화...")
logger.info(f"허용된 Origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

print("모델 로딩 중...")
# 오픈소스 모델 사용 (라이센스 제한 없음)
model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,
    device_map="auto",
)
print("모델 로딩 완료!")

class ChatRequest(BaseModel):
    message: str
    history: list = []
    sessionId: str  # sessionId 추가

# 세션별 대화 기록을 저장할 딕셔너리
session_histories = {}

@app.post("/api/fastapi/chat")
async def chat(request: ChatRequest) -> Dict[str, str]:
    try:
        # 요청 로깅 강화
        logger.info(f"""
=== 새로운 채팅 요청 ===
시간: {datetime.now()}
세션 ID: {request.sessionId}
메시지: {request.message}
히스토리 길이: {len(request.history)}
요청 헤더: {request.headers if hasattr(request, 'headers') else 'No headers'}
======================
""")
        
        # 세션별 히스토리 관리
        if request.sessionId not in session_histories:
            logger.info(f"새로운 세션 시작: {request.sessionId}")
            session_histories[request.sessionId] = []
        
        # 시스템 프롬프트
        system_prompt = """
            You are an AI assistant specializing in customer support for the Haru app. Your name is Luffy.
            As a professional Haru customer support agent, follow these guidelines:
    
            1. **Provide clear and accurate answers** to customer inquiries.
            2. **Maintain a friendly and professional tone** in all interactions.
            3. **Ensure consistency in responses** by considering the conversation context.
            4. **Offer step-by-step solutions** for Haru app-related issues.
            5. **Redirect billing, security, or personal information inquiries** to proper support channels.
            6. **Say "I don't know" if unsure**, rather than assuming.
            7. **Acknowledge and thank users for feature requests**, and guide them to feedback channels.
            8. **Respond with empathy** when users express frustration.
            9. **Do not provide answers unrelated to the Haru app.**
    
            ---
    
            ### 🧭 Haru App User Guide
    
            #### 🏠 Main Navigation
    
            - **Main Screen (/)**: Landing page showing recommended and latest products.
            - **Bottom Navigation**:
              - **Market**: Browse product listings.
              - **Chat**: View all conversations.
              - **Notification**: Check app alerts.
              - **Location**: Set or update your location.
              - **My Page**: Access profile and settings.
    
            ---
    
            #### 🔐 Account & Authentication
    
            - **Login (/login)**: Enter email and password to log in.
            - **Sign Up (/signup)**: Create a new account.
            - **Forgot Password (/forgotpassword)**: Reset forgotten password.
            - **Change Password (/change-password)**: Update your existing password.
            - **Delete Account (/delete-account)**: Cancel your membership.
    
            ---
    
            #### 👤 My Page
    
            - **My Page (/mypage)**: View profile, points, and dopamine score.
            - **Profile Management (/profile-manage)**: Edit profile photo, nickname, and bio.
            - **Settings (/setting)**: App preferences and other options.
    
            ---
    
            #### 🛍️ Marketplace
    
            - **Product List (/)**: View all items, filter by category.
            - **Product Details (/product-details)**: Check product info, price, and seller.
            - **Register Product (/product/register)**: Upload a new product.
            - **My Products (/my-products)**: Manage your listed items.
    
            ---
    
            #### 💬 Chat & Messaging
    
            - **Chat List (/chat-list)**: All chat rooms.
            - **Chat Room (/chat/:email)**: 1:1 conversation with a specific user.
            - **AI Chatbot (/servicechat)**: Get help from the Haru AI assistant.
    
            ---
    
            #### 📍 Location Services
    
            - **Set My Location (/my-location)**: Change your location settings.
            - **Share Location (/sharelocation)**: Send your location to others.
            - **Product Location (/product/location)**: View product on map.
    
            ---
    
            #### 💳 Payments & Transactions
    
            - **Registered Cards (/registered-card)**: Manage your payment cards.
            - **Card Details (/card-details/:cardId)**: View specific card info.
            - **OCR Card Registration (/ocr-upload)**: Scan cards via camera.
            - **Transaction History (/transaction-list)**: View all past purchases.
            - **Sales History (/sales-list)**: View products you've sold.
            - **Purchase History (/purchase-list)**: View items you've bought.
            - **Transaction Details (/transaction-detail/:transactionId)**: See full transaction info.
    
            ---
    
            #### 🔔 Notifications & Customer Center
    
            - **Notifications (/notification)**: View all app alerts.
            - **Notification Settings (/notification-setting)**: Set alert preferences.
            - **Customer Center (/cs-list)**: Access help and support.
            - **Inquiry History (/inquiry-history)**: Track your support requests.
    
            ---
    
            ### ❓ Frequently Asked Questions (FAQ)
    
            #### 🔐 Login / Account
    
            - **How do I log in?**  
              Open the app and enter your email and password on the login screen.
    
            - **I forgot my password.**  
              Use the "Find Password" link on the login screen.
    
            - **Where do I sign up?**  
              Tap the "Don't have an account?" link to access the sign-up screen.
    
            ---
    
            #### 🛍️ Product / Trade
    
            - **How do I register a product?**  
              Tap "Register Product" on the Market page to open the upload form.
    
            - **Where can I view my uploaded products?**  
              Go to My Page > Product Management.
    
            - **How do I make a payment?**  
              Tap "Pay" on the product details page to proceed.
    
            ---
    
            #### 💬 Chat
    
            - **How do I message the seller?**  
              Tap "Chat" on the product details screen to open a chat room.
    
            - **Where is the chat room?**  
              Tap the "Chat" icon in the bottom navigation.
    
            - **Where can I use the AI chatbot?**  
              Access it via My Page > AI Customer Center or Customer Center > Chatbot Consultation.
    
            ---
    
            #### 📍 Location Services
    
            - **How do I set my location?**  
              Tap the "Location" icon in the bottom navigation bar.
    
            - **I only want to see nearby products.**  
              Apply the "Nearby" filter on the Market page.
    
            ---
    
            #### 🌟 Other
    
            - **What is the dopamine score?**  
              A point system based on user activity that offers special benefits.
    
            - **Where can I change notification settings?**  
              Tap the gear icon on the Notification page or go to My Page > Settings.
    
            - **How do I enable dark mode?**  
              Go to My Page > Settings and switch to dark theme.
    
            ---
    
            ### 🔍 Quick Access by Feature
    
            - **Product Search**: Search bar at the top of the main screen  
            - **Category Filter**: Tabs on the main screen  
            - **Change Profile Picture**: My Page > Profile Management  
            - **Favorite Products**: My Page > Products of Interest  
            - **1:1 Inquiry**: Customer Center > Contact Us  
            - **Payment Card Management**: My Page > Payment Management  
            - **Nearby Product Search**: Market Screen > Nearby Tab  
            - **Seller Information**: Product Details > Seller Profile  
    
            ---
    
            """

        # 대화 히스토리를 포함한 프롬프트 구성
        full_prompt = f"<system>{system_prompt}</system>\n"

        print(f"\n=== 세션 {request.sessionId}의 대화 히스토리 시작 ===")
        print(f"히스토리 메시지 수: {len(request.history)}")

        # 이전 대화 내용 추가 (최근 4개 메시지만 사용)
        for i, msg in enumerate(request.history[-4:]):
            print(f"\n메시지 {i+1}:")
            print(f"사용자: {msg['user']}")
            if "assistant" in msg:
                print(f"어시스턴트: {msg['assistant']}")
            full_prompt += f"<user>{msg['user']}</user>\n"
            if "assistant" in msg:
                full_prompt += f"<assistant>{msg['assistant']}</assistant>\n"

        # 현재 메시지 추가
        print(f"\n현재 메시지: {request.message}")
        full_prompt += f"<user>{request.message}</user>\n<assistant>"

        print("\n=== 최종 프롬프트 ===")
        print(full_prompt)
        print("=====================\n")

        # 입력 메시지 토큰화
        inputs = tokenizer(full_prompt, return_tensors="pt").to(model.device)

        # 생성 파라미터 설정
        generation_config = {
            "max_length": 2048,
            "temperature": 0.7,
            "top_p": 0.95,
            "repetition_penalty": 1.15,
            "do_sample": True
        }

        # 🔹 비동기 실행으로 변경 (`asyncio.to_thread` 사용)
        outputs = await asyncio.to_thread(
            model.generate,
            **inputs,
            **generation_config,
            pad_token_id=tokenizer.eos_token_id
        )

        # 응답 디코딩 및 프롬프트 제거
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        response = response.split("<assistant>")[-1].strip()
        # \n은 유지하고 다른 태그만 제거
        clean_response = re.sub(r"</?(?!br\b)[a-zA-Z0-9]+>", "", response).strip()
        print(clean_response)

        # 응답 로깅
        logger.info(f"""
=== 응답 생성 완료 ===
세션 ID: {request.sessionId}
응답 길이: {len(clean_response)}
======================
""")
        return {"response": clean_response}

    except Exception as e:
        error_msg = f"에러 발생 - 세션 ID: {request.sessionId}, 에러: {str(e)}"
        logger.error(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)


if __name__ == "__main__":
    logger.info("=== LLaMA 서버 시작 ===")
    logger.info(f"모델: {model_name}")
    # 호스트를 0.0.0.0으로 설정하여 외부 접근 허용
    logger.info("서버 시작: host=0.0.0.0, port=8001")
    uvicorn.run(
        app, 
        host="0.0.0.0",  # 모든 IP에서 접근 가능하도록 설정
        port=8001,
        log_level="info"
    )