package com.example.demo.dto.Market;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionsRequest {
    private Long id;
    private Long productId;
    private String request_email;
    private String sellerEmail;
    private int price;
    private String description;
}
