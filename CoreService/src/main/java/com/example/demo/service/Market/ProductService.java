package com.example.demo.service.Market;

import com.example.demo.dto.Market.ProductRequest;
import com.example.demo.dto.Market.ProductResponse;
import com.example.demo.mapper.Market.ProductMapper;
import com.example.demo.mapper.Market.ProductImageMapper;
import com.example.demo.model.Market.Product;
import com.example.demo.model.Market.ProductImage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductMapper productMapper;
    private final ProductImageMapper productImageMapper;
    private final ImageUploadService imageUploadService;  //이미지 업로드 서비스 추가

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

            // 상품 정보 저장
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
            Long productId = product.getId();


            // 이미지 경로가 있을 경우 ProductImages 테이블에 저장
            if (request.getImagePaths() != null && !request.getImagePaths().isEmpty()) {
                for (String path : request.getImagePaths()) {
                    ProductImage productImage = ProductImage.builder()
                            .productId(productId)
                            .imagePath(path)
                            .isThumbnail(false)
                            .build();

                    productImageMapper.insertProductImage(productImage); // 실제 DB에 삽입하는 부분
                }
            }

            return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                    "status", 200,
                    "message", "상품이 성공적으로 등록되었습니다.",
                    "productId", productId
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

        // 상품 ID에 해당하는 이미지 경로 리스트 가져오기
        List<String> imagePaths = productImageMapper.findByProductId(id).stream()
                .map(ProductImage::getImagePath)
                .collect(Collectors.toList());

        return ProductResponse.builder()
                .id(product.getId())
                .productCode(product.getProductCode()) // productCode 추가
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
                .imagePaths(imagePaths)  // 이미지 리스트 추가
                .thumbnailPath(product.getThumbnailPath()) // 대표 이미지 추가
                .build();
    }

    // MySQL에서 정렬하도록 변경
    public List<ProductResponse> getProducts(Long categoryId, String sort) {
        // 정렬 옵션 확인
        if (sort != null && !sort.equals("price") && !sort.equals("createdAt")) {
            throw new IllegalArgumentException("잘못된 정렬 옵션입니다. 'price' 또는 'createdAt'만 사용할 수 있습니다.");
        }

        // DB에서 정렬 수행
        List<Product> products = productMapper.findFilteredProducts(categoryId, sort);

        return products.stream()
                .map(product -> ProductResponse.builder()
                        .id(product.getId())
                        .productCode(product.getProductCode()) // productCode 추가
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
                        .imagePaths(product.getImagePaths()) // 이미지 경로 추가
                        .thumbnailPath(product.getThumbnailPath()) // 대표 이미지 추가
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * 내가 등록한 상품 목록 조회 (구매만)
     */
    public List<ProductResponse> getMyRegisteredBuyProducts(String email) {
        return productMapper.findProductsByEmailAndType(email, List.of("구매"));
    }

    /**
     * 내가 등록한 상품 목록 조회 (판매만)
     */
    public List<ProductResponse> getMyRegisteredSellProducts(String email) {
        return productMapper.findProductsByEmailAndType(email, List.of("판매"));
    }

    /**
     * 내가 요청한 상품 목록 조회 (구매 요청만)
     */
    public List<ProductResponse> getMyRequestedBuyProducts(String email) {
        return productMapper.findProductsByEmailAndType(email, List.of("구매 요청"));
    }

    /**
     * 내가 요청한 상품 목록 조회 (판매 요청만)
     */
    public List<ProductResponse> getMyRequestedSellProducts(String email) {
        return productMapper.findProductsByEmailAndType(email, List.of("판매 요청"));
    }
}

