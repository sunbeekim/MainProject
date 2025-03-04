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
    private Long hobbyId;
    private String transactionType;
    private String registrationType;
    private LocalDateTime createdAt;
    private List<ProductImageResponse> images; // 상품 이미지 리스트 추가
}