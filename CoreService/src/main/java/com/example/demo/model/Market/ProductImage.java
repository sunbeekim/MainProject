package com.example.demo.model.Market;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImage {
    private Long id;
    private Long productId;
    private String imagePath;
    private Boolean isThumbnail;
    private LocalDateTime createdAt;
}