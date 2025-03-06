package com.example.demo.service.Market;

import com.example.demo.dto.Market.ProductRequest;
import com.example.demo.dto.Market.ProductResponse;
import com.example.demo.mapper.Market.ProductMapper;
import com.example.demo.mapper.Market.ProductImageMapper;
import com.example.demo.model.Market.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductMapper productMapper;
    private final ProductImageMapper productImageMapper;

    public ResponseEntity<Object> createProduct(ProductRequest request) {
        try {
            // "대면" 거래일 경우, 위치 정보가 없으면 예외 발생
            if ("대면".equals(request.getTransactionType())) {
                if (request.getLatitude() == null || request.getLongitude() == null || request.getMeetingPlace() == null) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                            "status", 400,
                            "error", "Bad Request",
                            "message", "대면 거래의 경우 위도(latitude), 경도(longitude), 거래 장소(meetingPlace)는 필수 입력 값입니다."
                    ));
                }
            }

            Product product = Product.builder()
                    .productCode(UUID.randomUUID().toString())
                    .title(request.getTitle())
                    .description(request.getDescription())
                    .price(request.getPrice())
                    .email(request.getEmail())
                    .categoryId(request.getCategoryId())
                    .transactionType(request.getTransactionType())
                    .registrationType(request.getRegistrationType())
                    .latitude(request.getLatitude())
                    .longitude(request.getLongitude())
                    .meetingPlace(request.getMeetingPlace())
                    .address(request.getAddress())
                    .build();

            productMapper.insertProduct(product);

            return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                    "status", 200,
                    "message", "상품이 성공적으로 등록되었습니다.",
                    "productId", product.getId()
            ));

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "status", 500,
                    "error", "Internal Server Error",
                    "message", ex.getMessage()
            ));
        }
    }

    public ProductResponse getProductById(Long id) {
        Product product = productMapper.findById(id);
        if (product == null) {
            throw new RuntimeException("해당 상품을 찾을 수 없습니다.");
        }
        return ProductResponse.builder()
                .id(product.getId())
                .title(product.getTitle())
                .description(product.getDescription())
                .price(product.getPrice())
                .email(product.getEmail())
                .categoryId(product.getCategoryId())
                .transactionType(product.getTransactionType())
                .registrationType(product.getRegistrationType())
                .latitude(product.getLatitude())
                .longitude(product.getLongitude())
                .meetingPlace(product.getMeetingPlace())
                .address(product.getAddress())
                .createdAt(product.getCreatedAt())
                .build();
    }

    // 카테고리 필터 + 가격순/최신순 정렬 추가
    public List<ProductResponse> getProducts(Long categoryId, String sort) {
        List<Product> products;

        // 카테고리 필터링
        if (categoryId != null) {
            products = productMapper.findByCategory(categoryId);
        } else {
            products = productMapper.findAll();
        }

        // 정렬 기능 추가
        if ("price".equals(sort)) {
            products.sort(Comparator.comparingInt(Product::getPrice));
        } else if ("createdAt".equals(sort)) {
            products.sort(Comparator.comparing(Product::getCreatedAt).reversed());
        } else if (sort != null) {
            throw new IllegalArgumentException("잘못된 정렬 옵션입니다. 'price' 또는 'createdAt'만 사용할 수 있습니다.");
        }

        return products.stream()
                .map(product -> ProductResponse.builder()
                        .id(product.getId())
                        .title(product.getTitle())
                        .description(product.getDescription())
                        .price(product.getPrice())
                        .email(product.getEmail())
                        .categoryId(product.getCategoryId())
                        .transactionType(product.getTransactionType())
                        .registrationType(product.getRegistrationType())
                        .latitude(product.getLatitude())
                        .longitude(product.getLongitude())
                        .meetingPlace(product.getMeetingPlace())
                        .address(product.getAddress())
                        .createdAt(product.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
