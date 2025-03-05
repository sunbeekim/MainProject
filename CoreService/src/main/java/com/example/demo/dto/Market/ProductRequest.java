package com.example.demo.dto.Market;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    private Integer price;

    @NotBlank
    private String email;

    @NotNull
    private Long categoryId;

    @NotBlank
    private String transactionType;

    @NotBlank
    private String registrationType;

    private String meetingPlace;

    private Double latitude;  // 위도 (대면 거래일 경우만 필수)
    private Double longitude; // 경도 (대면 거래일 경우만 필수)
    private String address;   // 주소 (선택적 입력 가능)
}
