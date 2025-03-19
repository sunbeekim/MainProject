package com.example.demo.model.Market;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Transaction {
    private Long id;
    private Long productId;
    private String buyerEmail;
    private String sellerEmail;
    private String transactionStatus;
    private String paymentStatus;
    private int price;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}