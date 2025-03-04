package com.example.demo.dto.Market;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImageRequest {
    @NotNull
    private Long productId;

    @NotBlank
    private String imagePath;

    private Boolean isThumbnail = false;
}