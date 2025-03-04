package com.example.demo.dto.Market;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @Min(0)
    private int price;

    @NotBlank
    private String email;

    @NotNull
    private Long categoryId;

    @NotNull
    private Long hobbyId;

    @NotBlank
    private String transactionType;

    @NotBlank
    private String registrationType;
}