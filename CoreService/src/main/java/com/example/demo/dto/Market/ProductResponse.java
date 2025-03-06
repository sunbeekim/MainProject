package com.example.demo.dto.Market;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private Long id;
    private String title;
    private String description;
    private int price;
    private String email;
    private Long categoryId;
    private String transactionType;
    private String registrationType;
    private Double latitude; // 거래 장소 위도
    private Double longitude; // 거래 장소 경도
    private String meetingPlace; // 거래 장소명
    private String address; // 거래 장소 주소
    private LocalDateTime createdAt;
    private List<ProductImageResponse> images;
}
