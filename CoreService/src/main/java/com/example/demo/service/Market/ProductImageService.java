package com.example.demo.service.Market;


import com.example.demo.dto.Market.ProductImageRequest;
import com.example.demo.dto.Market.ProductImageResponse;
import com.example.demo.mapper.Market.ProductImageMapper;
import com.example.demo.model.Market.ProductImage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductImageService {
    private final ProductImageMapper productImageMapper;

    public void addProductImage(ProductImageRequest request) {
        ProductImage productImage = ProductImage.builder()
                .productId(request.getProductId())
                .imagePath(request.getImagePath())
                .isThumbnail(request.getIsThumbnail())
                .build();

        productImageMapper.insertProductImage(productImage);
    }

    /**
     * 특정 상품의 이미지 리스트 조회 (메서드 추가)
     */
    public List<ProductImageResponse> getImagesByProductId(Long productId) {
        return productImageMapper.findByProductId(productId).stream()
                .map(image -> ProductImageResponse.builder()
                        .id(image.getId())
                        .productId(image.getProductId())
                        .imagePath(image.getImagePath())
                        .isThumbnail(image.getIsThumbnail())
                        .createdAt(image.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}

