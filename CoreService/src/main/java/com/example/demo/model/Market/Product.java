package com.example.demo.model.Market;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    private Long id;
    private String productCode;
    private String title;
    private String description;
    private int price;
    private String email; // FK (Users 테이블)
    private Long categoryId; // FK (Categories 테이블)
    private Long hobbyId; // FK (Hobbies 테이블)
    private String transactionType;
    private String registrationType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
