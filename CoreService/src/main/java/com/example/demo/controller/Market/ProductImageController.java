package com.example.demo.controller.Market;


import com.example.demo.dto.Market.ProductImageRequest;
import com.example.demo.dto.Market.ProductImageResponse;
import com.example.demo.service.Market.ProductImageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product-images")
@RequiredArgsConstructor
public class ProductImageController {
    private final ProductImageService productImageService;

    /**
     * 상품 이미지 등록
     */
    @PostMapping
    public ResponseEntity<String> addProductImage(@Valid @RequestBody ProductImageRequest request) {
        productImageService.addProductImage(request);
        return ResponseEntity.ok("이미지가 등록되었습니다.");
    }

    /**
     * 특정 상품의 이미지 조회
     */
    @GetMapping("/{productId}")
    public ResponseEntity<List<ProductImageResponse>> getProductImages(@PathVariable Long productId) {
        return ResponseEntity.ok(productImageService.getImagesByProductId(productId));
    }
}