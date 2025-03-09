package com.example.demo.controller.Market;

import com.example.demo.dto.Market.ProductRequest;
import com.example.demo.dto.Market.ProductResponse;
import com.example.demo.service.Market.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/core/market/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    /**
     * 상품 등록 (구매/판매)
     */
    @PostMapping("/registers")
    public ResponseEntity<Object> createProduct(@RequestBody ProductRequest request) {
        if (!request.getRegistrationType().equals("구매") && !request.getRegistrationType().equals("판매")) {
            return ResponseEntity.badRequest().body("잘못된 상품 등록 요청입니다.");
        }
        return productService.createProduct(request);
    }

    /**
     * 상품 요청 등록 (구매 요청/판매 요청)
     */
    @PostMapping("/requests")
    public ResponseEntity<Object> createRequest(@RequestBody ProductRequest request) {
        if (!request.getRegistrationType().equals("구매 요청") && !request.getRegistrationType().equals("판매 요청")) {
            return ResponseEntity.badRequest().body("잘못된 요청 등록입니다.(구매 요청, 판매 요청은 필수 입력 값입니다.)");
        }
        return productService.createProduct(request);  // 동일한 서비스 로직 재사용 가능
    }

    /**
     * 개별 상품 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<Object> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    /**
     * 카테고리별 필터 + 가격순/최신순 정렬
     */
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getProducts(
            @RequestParam(required = false) Long categoryId, // 카테고리 필터
            @RequestParam(required = false) String sort) { // 정렬 옵션 (price, createdAt))
        return ResponseEntity.ok(productService.getProducts(categoryId, sort));
    }

    /**
     * 내가 등록한 상품 목록 조회 (구매만)
     */
    @GetMapping("/registers/my/buy")
    public ResponseEntity<List<ProductResponse>> getMyRegisteredBuyProducts(@RequestParam String email) {
        return ResponseEntity.ok(productService.getMyRegisteredBuyProducts(email));
    }

    /**
     * 내가 등록한 상품 목록 조회 (판매만)
     */
    @GetMapping("/registers/my/sell")
    public ResponseEntity<List<ProductResponse>> getMyRegisteredSellProducts(@RequestParam String email) {
        return ResponseEntity.ok(productService.getMyRegisteredSellProducts(email));
    }

    /**
     * 내가 요청한 상품 목록 조회 (구매 요청만)
     */
    @GetMapping("/requests/my/buy")
    public ResponseEntity<List<ProductResponse>> getMyRequestedBuyProducts(@RequestParam String email) {
        return ResponseEntity.ok(productService.getMyRequestedBuyProducts(email));
    }

    /**
     * 내가 요청한 상품 목록 조회 (판매 요청만)
     */
    @GetMapping("/requests/my/sell")
    public ResponseEntity<List<ProductResponse>> getMyRequestedSellProducts(@RequestParam String email) {
        return ResponseEntity.ok(productService.getMyRequestedSellProducts(email));
    }
}




