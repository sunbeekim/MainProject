package com.example.demo.controller.Market;


import com.example.demo.dto.Market.ProductRequest;
import com.example.demo.dto.Market.ProductResponse;
import com.example.demo.service.Market.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    /**
     * 상품 등록
     */
    @PostMapping
    public ResponseEntity<String> createProduct(@Valid @RequestBody ProductRequest request) {
        productService.createProduct(request);
        return ResponseEntity.ok("상품이 등록되었습니다.");
    }

    /**
     * 특정 상품 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    /**
     * 전체 상품 조회
     */
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
}