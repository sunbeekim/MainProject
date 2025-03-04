package com.example.demo.service.Market;

import com.example.demo.dto.Market.ProductRequest;
import com.example.demo.dto.Market.ProductResponse;
import com.example.demo.mapper.Market.ProductMapper;
import com.example.demo.mapper.Market.ProductImageMapper;
import com.example.demo.model.Market.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductMapper productMapper;
    private final ProductImageMapper productImageMapper;

    public void createProduct(ProductRequest request) {
        Product product = Product.builder()
                .productCode(UUID.randomUUID().toString())
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .email(request.getEmail())
                .categoryId(request.getCategoryId())
                .hobbyId(request.getHobbyId())
                .transactionType(request.getTransactionType())
                .registrationType(request.getRegistrationType())
                .build();

        productMapper.insertProduct(product);
    }

    public ProductResponse getProductById(Long id) {
        Product product = productMapper.findById(id);
        return ProductResponse.builder()
                .id(product.getId())
                .title(product.getTitle())
                .description(product.getDescription())
                .price(product.getPrice())
                .email(product.getEmail())
                .categoryId(product.getCategoryId())
                .hobbyId(product.getHobbyId())
                .transactionType(product.getTransactionType())
                .registrationType(product.getRegistrationType())
                .createdAt(product.getCreatedAt())
                .build();
    }

    /**
     * 모든 상품 조회 (메서드 추가)
     */
    public List<ProductResponse> getAllProducts() {
        return productMapper.findAll().stream()
                .map(product -> ProductResponse.builder()
                        .id(product.getId())
                        .title(product.getTitle())
                        .description(product.getDescription())
                        .price(product.getPrice())
                        .email(product.getEmail())
                        .categoryId(product.getCategoryId())
                        .hobbyId(product.getHobbyId())
                        .transactionType(product.getTransactionType())
                        .registrationType(product.getRegistrationType())
                        .createdAt(product.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
