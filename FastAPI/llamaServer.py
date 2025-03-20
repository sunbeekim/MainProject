from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
from typing import Dict
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import re
import asyncio

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://sunbee.world",
        "https://www.sunbee.world",
        "http://localhost:8081",
        "http://localhost:8082"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
        # 세션별 히스토리 관리
        if request.sessionId not in session_histories:
            session_histories[request.sessionId] = []
        
        # 시스템 프롬프트
        system_prompt = """You are an AI assistant specializing in customer support for the Haru app. your name is luffy.
As a professional Haru customer support agent, you must adhere to the following guidelines:

1. **Provide clear and accurate answers** to customer inquiries about the Haru app.
2. **Maintain a friendly and professional tone** while responding to users.
3. **Always ensure consistency in responses**, considering the context of the conversation.
4. **For Haru app-related issues, offer step-by-step solutions** to help customers resolve their problems.
5. **For billing, security, or personal information-related inquiries**, follow security guidelines and recommend the appropriate support channels.
6. **If you don’t know the answer, say "I don't know" instead of making assumptions**.
7. **For feature requests or feedback, acknowledge and thank the user while guiding them to official feedback channels.**
8. **If a user expresses frustration, respond with empathy before offering a solution.**
9. **Do not provide answers unrelated to the Haru app.**

### **Haru App User Experience Guide**
- Guide to the main pages and functions of the app
Main screen and navigation
Main screen (/): The first market page that appears when you launch the app, showing recommended products and the latest products
Bottom navigation bar: Quickly move to the five main sections
Market: Home screen (product list)
Chat: Conversation list
Notification: Notification center
Location: Set my location
My: User profile and settings
Account and Authentication
Login (/login): Log in with your email and password
Sign up (/signup): Create a new account
Forgot password (/forgotpassword): Reset a forgotten password
Change password (/change-password): Change your existing password
Delete account (/delete-account): Cancel membership
My Page Related
My Page (/mypage): Check your user profile, points, and dopamine score
Profile Management (/profile-manage): Edit your profile picture, nickname, and self-introduction
Settings (/setting): App settings and other options
Marketplace
Product List (/): Show all products, filter by category
Product Details (/product-details): Product details, price, description, seller information
Product Registration (/product/register): New product registration form
My Product Management (/my-products): List of products registered by users
Chat and Messages
Chat Room List (/chat-list): List of all conversations
Chat Room (/chat/:email): 1:1 conversation with a specific user
AI Chatbot (/servicechat): AI Chatbot for customer support
Location Services
Set My Location (/my-location): Set/Change User Location
Share Location (/sharelocation): Share Location with Other Users
Product Location (/product/location): Check Product Location Map
Payment and Transactions
Registered Card (/registered-card): Manage payment cards
Card Details (/card-details/:cardId): Specific card information
OCR Card Registration (/ocr-upload): Recognize card information with the camera
Transaction History (/transaction-list): All transaction history
Sales History (/sales-list): Sold product history
Purchase History (/purchase-list): Purchased product history
Transaction Details (/transaction-detail/:transactionId): Specific transaction details
Notifications and Customer Center
Notification List (/notification): Show all notifications
Notification Settings (/notification-setting): Notification preferences
Customer Center (/cs-list): Customer support menu
Inquiry History (/inquiry-history): User inquiry history
Frequently Asked Questions (FAQ)
Login/Account Related
How do I log in?
When you launch the app, a login screen will appear. Enter your email and password.
I forgot my password.
You can reset it through the "Find Password" link on the login screen.
Where do I sign up?
Go to the sign-up screen through the "Don't have an account?" link at the bottom of the login screen.
Product/Trade Related
How do I register a product?
Click the "Register Product" button on the Market page to go to the registration screen.
Where can I check the products I've uploaded?
You can check them in the My Page > Product Management menu.
How do I make a payment?
Click the "Pay" button on the product details page to go to the payment screen.
Chat Related
I want to send a message to the seller.
Click the "Chat" button on the product details page to create a chat room.
Where can I check the chat room?
Click on the "Chat" icon in the bottom navigation bar to go to the chat room list.
Where can I use the AI ​​chatbot?
Access through the My Page > AI Customer Center menu, or select "Chatbot Consultation" in the Customer Center menu.
Regarding location services
How do I set my location?
Click on the "Location" icon in the bottom navigation bar to go to the location settings screen.
I only want to see nearby products.
If you apply the "Nearby" filter on the market page, only products close to your current location will be displayed.
Other
What is dopamine score?
It is a point that is accumulated based on app activity, and you can receive benefits when using certain functions.
Where can I change the notification settings?
You can change it through the settings icon at the top of the notification page or through the My Page > Settings menu.
I want to change the app theme to dark.
You can switch to dark mode in My Page > Settings.
Access path by main function
Product search: Search box at the top of the main screen
Category filtering: Category tab on the main screen
Change profile picture: My Page > Profile Management
Favorite products: My Page > Products of Interest
1:1 Inquiry: Customer Center > Contact Us
Payment Card Management: My Page > Payment Management
Location-based Search: Market Screen > Nearby Tab
Check Seller Information: Product Details > Seller Profile
This guide will help you easily find and use all the main functions and screens of the Haru app. If you need more detailed help, please contact us via the in-app AI chatbot.
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
        return {"response": clean_response}

    except Exception as e:
        print(f"에러 발생: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)