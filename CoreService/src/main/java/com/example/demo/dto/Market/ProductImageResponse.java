package com.example.demo.dto.Market;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImageResponse {
    private Long id;
    private Long productId;
    private String imagePath;
    private Boolean isThumbnail;
    private LocalDateTime createdAt;
}