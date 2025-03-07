package com.example.demo.serviceimpl;

import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;
import net.nurigo.sdk.NurigoApp;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import java.util.concurrent.*;

@Service
public class SmsService {

  private final DefaultMessageService messageService;
  private final Map<String, String> otpStore = new ConcurrentHashMap<>(); // Thread-safe 저장소
  private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1); // 타이머 스레드

  public SmsService(
      @Value("${sms.api.key}") String apiKey,
      @Value("${sms.api.secret}") String apiSecret,
      @Value("${sms.api.url}") String apiUrl) {
    this.messageService = NurigoApp.INSTANCE.initialize(apiKey, apiSecret, apiUrl);
  }

  public SingleMessageSentResponse sendSms(String phoneNumber) {
    try {
      // 디버깅 로그 추가
      System.out.println("SMS 발송 시작: phoneNumber=" + phoneNumber);

      // 랜덤 인증번호 생성
      String verificationCode = String.valueOf(new Random().nextInt(9000) + 1000);
      System.out.println("생성된 인증번호: " + verificationCode);

      // 인증번호 저장
      otpStore.put(phoneNumber, verificationCode);
      System.out.println("인증번호 저장 완료: " + otpStore);

      // 메시지 생성
      String text = "인증번호는 [" + verificationCode + "] 입니다.";
      String from = "01065877718"; // 발신 번호
      System.out.println("메시지 내용: " + text);

      Message message = new Message();
      message.setFrom(from);
      message.setTo(phoneNumber);
      message.setText(text);

      // SMS 발송
      System.out.println("CoolSMS API 호출 시작");
      SingleMessageSentResponse response = messageService.sendOne(new SingleMessageSendingRequest(message));
      System.out.println("발송 응답: " + response);

      return response;
    } catch (Exception e) {
      System.err.println("SMS 발송 중 오류: " + e.getMessage());
      e.printStackTrace();
      throw new RuntimeException("SMS 발송 중 오류가 발생했습니다.", e);
    }
  }

  public boolean verifyCode(String phoneNumber, String code) {
    String storedCode = otpStore.get(phoneNumber);
    System.out.println("storedCode :" + storedCode);
    return storedCode != null && storedCode.equals(code);
  }
}