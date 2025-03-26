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
    private String buyerEmail;
    private String sellerEmail;
    private String buyerEmail;
    private int price;
    private String description;
}
