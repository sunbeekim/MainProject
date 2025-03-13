// API 응답 구조 통일을 위한 공통 클래스
package com.example.demo.util;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BaseResponse<T> {
    private String status;  // ✅ 상태 필드 추가
    private String message; // ✅ 메시지 필드 추가
    private T data;

    // ✅ 성공 응답 생성자
    public BaseResponse(T data) {
        this.status = "success";
        this.message = "요청이 성공적으로 처리되었습니다.";
        this.data = data;
    }

    // ✅ 커스텀 메시지를 포함한 성공 응답
    public BaseResponse(T data, String message) {
        this.status = "success";
        this.message = message;
        this.data = data;
    }

    // ✅ 에러 응답 (명확한 타입 지정)
    public BaseResponse(String status, String message) {
        this.status = status;
        this.message = message;
        this.data = null;  // ✅ 에러일 경우 data를 null로 설정
    }
}
