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
    private String status;  // ✅ "success" 또는 "error"
    private String message; // ✅ 응답 메시지
    private T data;         // ✅ 응답 데이터 (에러 시 null)

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

    // ✅ 에러 응답을 제네릭 타입에 맞게 반환 (🚀 중요!)
    public static <T> BaseResponse<T> errorResponse(String message, T data) {
        return new BaseResponse<>("error", message, data);
    }

    // ✅ 데이터가 필요 없는 에러 응답
    public static <T> BaseResponse<T> errorResponse(String message) {
        return new BaseResponse<>("error", message, null);
    }
}
