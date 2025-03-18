package com.example.demo.service.Market;

import com.example.demo.dto.Market.ProductRequest;
import com.example.demo.dto.Market.ProductResponse;
import com.example.demo.dto.chat.ChatRoomRequest;
import com.example.demo.dto.chat.ChatRoomResponse;
import com.example.demo.mapper.Market.ProductMapper;
import com.example.demo.mapper.Market.ProductImageMapper;
import com.example.demo.model.Market.Product;
import com.example.demo.model.Market.ProductImage;
import com.example.demo.service.ChatService;
import com.example.demo.util.BaseResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.core.type.TypeReference;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {
    private final ProductMapper productMapper;
    private final ProductImageMapper productImageMapper;
    private final NotificationService notificationService;
    private final ImageUploadService imageUploadService;
    private final ChatService chatService;

    /** 전체 상품 목록 조회 (등록자 상품 조회 항상가능, 비로그인자 모집 중인 상품 조회 가능) **/
    public ResponseEntity<BaseResponse<List<ProductResponse>>> getAllProducts(String email) {
        try {
            List<ProductResponse> products = productMapper.findAll(email).stream()
                    .map(this::convertToProductResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new BaseResponse<>(products));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body(new BaseResponse<>(null, "전체 상품 조회 중 오류 발생: " + ex.getMessage()));
        }
    }


    /** 상품 등록 (이미지도 함께 업로드) **/
    public ResponseEntity<BaseResponse<ProductResponse>> createProduct(String email, ProductRequest request, List<MultipartFile> images) {
        try {
            if ("대면".equals(request.getTransactionType()) &&
                    (request.getLatitude() == null || request.getLongitude() == null || request.getMeetingPlace() == null)) {
                return ResponseEntity.badRequest()
                        .body(new BaseResponse<>(null, "대면 거래의 경우 위치 정보는 필수 입력 값입니다."));
            }

            ObjectMapper objectMapper = new ObjectMapper();
            String daysJson = objectMapper.writeValueAsString(request.getDays()); // List<String> → JSON 변환

            // 상품 정보 저장
            Product product = Product.builder()
                    .productCode(UUID.randomUUID().toString())
                    .title(request.getTitle())
                    .description(request.getDescription())
                    .price(request.getPrice())
                    .email(email)
                    .categoryId(request.getCategoryId())
                    .hobbyId(request.getHobbyId())
                    .transactionType(request.getTransactionType())
                    .registrationType(request.getRegistrationType())
                    .maxParticipants(request.getMaxParticipants())
                    .currentParticipants(0)
                    .isVisible(true)
                    .startDate(request.getStartDate())
                    .endDate(request.getEndDate())
                    .latitude(request.getLatitude())
                    .longitude(request.getLongitude())
                    .meetingPlace(request.getMeetingPlace())
                    .address(request.getAddress())
                    .days(daysJson)
                    .build();

            productMapper.insertProduct(product);
            Long productId = product.getId();

            // 이미지 업로드 및 DB 저장 --? 삭제
            if (images != null && !images.isEmpty()) {
                // 한 개의 이미지도 리스트로 만들어서 `uploadProductImages` 호출
                ResponseEntity<Object> response = imageUploadService.uploadProductImages(email, productId, images);

                // 업로드된 이미지 경로를 가져와서 ProductImage 테이블에 저장
                if (response.getStatusCode().is2xxSuccessful()) {
                    Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
                    List<String> imagePaths = (List<String>) responseBody.get("imagePaths");

                    for (String imagePath : imagePaths) {
                        ProductImage productImage = ProductImage.builder()
                                .productId(productId)
                                .imagePath(imagePath)
                                .isThumbnail(false)
                                .build();
                        productImageMapper.insertProductImage(productImage);
                    }
                }
            }

            // 변환된 ProductResponse 생성
            ProductResponse productResponse = convertToProductResponse(product);

            // 성공 메시지
            return ResponseEntity.ok(new BaseResponse<>("success", "상품이 성공적으로 등록되었습니다.", productResponse));

        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body(BaseResponse.<ProductResponse>error("상품 등록 중 오류 발생: " + ex.getMessage()));
        }
    }

    /** 상품 요청 등록 (구매 요청/판매 요청) + 알림 전송  **/
    public ResponseEntity<BaseResponse<Map<String, Object>>> createProductRequest(String requesterEmail, Long productId) {
        try {
            String productOwnerEmail = productMapper.findEmailByProductId(productId);
            if (productOwnerEmail == null) {
                return ResponseEntity.badRequest()
                        .body(new BaseResponse<>(null, "해당 상품을 찾을 수 없습니다."));
            }

            // 요청 등록 및 관련 데이터 업데이트
            productMapper.insertProductRequest(productId, requesterEmail);
            productMapper.increaseCurrentParticipants(productId);
            productMapper.updateProductVisibility(productId); // 모집 마감 여부 확인

            // 알림 전송
            notificationService.sendNotification(productOwnerEmail, requesterEmail, productId);

            // 상품 정보 가져오기 (등록자는 마감된 상품도 조회 가능)
            Product product = productMapper.findById(productId, requesterEmail);
            if (product == null) {
                return ResponseEntity.internalServerError()
                        .body(new BaseResponse<>(null, "상품 요청은 저장되었지만, 상품 정보를 가져오는 데 실패했습니다."));
            }

            // 모집 인원 충족 시 자동으로 상태를 '완료'로 변경
            if (product.getCurrentParticipants() >= product.getMaxParticipants()) {
                productMapper.updateRequestStatusToComplete(productId);
            }

            // 요청 유형 구분 (구매 요청인지 판매 요청인지 확인)
            String requestType = product.getRegistrationType().equals("판매") ? "구매 요청" : "판매 요청";

            // 요청 정보 그룹화
            Map<String, Object> requestInfo = new HashMap<>();
            requestInfo.put("productId", product.getId());
            requestInfo.put("requesterEmail", requesterEmail);
            requestInfo.put("status", "대기");
            requestInfo.put("approvalStatus", "미승인");
            requestInfo.put("requestType", requestType); // 요청 유형 추가 (구매 요청 or 판매 요청)

            // 최종 응답 데이터 구성
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("requestInfo", requestInfo);
            responseData.put("requestedProductId", product.getId()); // 요청한 상품 ID 포함
            responseData.put("productInfo", convertToProductResponse(product)); // `convertToProductResponse()`로 변환된 데이터 사용

            return ResponseEntity.ok(new BaseResponse<>(responseData));

        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body(new BaseResponse<>(null, "상품 요청 중 오류 발생: " + ex.getMessage()));
        }
    }

    /** 승인된 요청 목록 조회 **/
    public ResponseEntity<BaseResponse<Map<String, Object>>> getApprovedRequests(Long productId) {
        try {
            // 승인된 요청 목록 가져오기
            List<Map<String, Object>> approvedRequests = productMapper.findApprovedRequests(productId);

            // 데이터가 없을 경우 처리
            if (approvedRequests == null || approvedRequests.isEmpty()) {
                return ResponseEntity.ok(new BaseResponse<>(null, "승인된 요청이 없습니다."));
            }

            // 응답 데이터 구성
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("status", "success");
            responseData.put("data", approvedRequests);

            return ResponseEntity.ok(new BaseResponse<>(responseData));

        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body(new BaseResponse<>(null, "승인된 요청 조회 중 오류 발생: " + ex.getMessage()));
        }
    }


    /** 개별 상품 조회 **/
    public ProductResponse getProductById(Long id, String email) {
        Product product = productMapper.findById(id, email);
        if (product == null) {
            throw new RuntimeException("해당 상품을 찾을 수 없습니다.");
        }

        return convertToProductResponse(product);
    }

    /** 상품 요청 승인 **/
    public ResponseEntity<BaseResponse<String>> approveProductRequest(String ownerEmail, Long productId, Long requestId) {
        try {
            // 상품 정보 가져오기 (등록자는 is_visible = FALSE 여도 조회 가능하도록)
            Product product = productMapper.findById(productId, ownerEmail);

            if (product == null) {
                return ResponseEntity.status(404).body(new BaseResponse<>("해당 상품을 찾을 수 없습니다."));
            }

            // 요청자의 이메일 가져오기
            String requesterEmail = productMapper.findRequesterEmailByRequestId(requestId);

            // 등록자와 요청자가 같은 경우 승인 불가능
            if (ownerEmail.equals(requesterEmail)) {
                return ResponseEntity.status(403).body(new BaseResponse<>("승인 실패: 등록자와 요청자가 동일합니다."));
            }

            // 상품 등록자가 아닌 경우 승인 불가능
            if (!product.getEmail().equals(ownerEmail)) {
                return ResponseEntity.status(403).body(new BaseResponse<>("해당 상품의 등록자만 요청을 승인할 수 있습니다."));
            }

            // 현재 승인된 참여 인원 가져오기 (미승인 요청 제외)
            int approvedParticipants = productMapper.getCurrentParticipants(productId);

            // 최대 인원 확인 (승인된 인원 기준)
            if (approvedParticipants >= product.getMaxParticipants()) {
                return ResponseEntity.status(400).body(new BaseResponse<>("승인 불가: 최대 참여 인원을 초과할 수 없습니다."));
            }
            // 상품 요청 승인 처리
            productMapper.updateRequestApprovalStatus(requestId, "승인");

            // 승인된 요청 수 증가 반영 후 체크
            approvedParticipants++;

            // 모집이 완료된 경우 자동으로 상태를 '완료'로 변경
            if (approvedParticipants >= product.getMaxParticipants()) {
                // 승인된 요청들의 상태도 '완료'로 변경
                productMapper.updateRequestStatusToComplete(productId);
                // 상품 모집 상태 마감 처리
                productMapper.updateProductStatusToComplete(productId);
            }

            return ResponseEntity.ok(new BaseResponse<>("상품 요청이 승인되었습니다."));

        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body(new BaseResponse<>("상품 요청 승인 중 오류 발생: " + ex.getMessage()));
        }
    }

    /** 상품 목록 조회 (is_visible = TRUE인 상품만 조회) **/
    public List<ProductResponse> getProducts(Long categoryId, String sort) {
        return productMapper.findFilteredProducts(categoryId, sort).stream()
                .map(this::convertToProductResponse) // DTO 변환
                .filter(ProductResponse::isVisible) // 모집 마감된 상품 제외
                .collect(Collectors.toList());
    }


    /** 특정 사용자가 등록한 상품 목록 조회 (구매, 판매, 구매 요청, 판매 요청) **/
    public ResponseEntity<BaseResponse<List<ProductResponse>>> getProductsByUserAndType(String email, List<String> types) {
        try {
            List<Product> products = productMapper.findProductsByEmailAndType(email, types);

            // ProductResponse로 변환
            List<ProductResponse> productResponses = products.stream()
                    .map(this::convertToProductResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new BaseResponse<>(productResponses));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body(new BaseResponse<>(null, "사용자별 상품 목록 조회 중 오류 발생: " + ex.getMessage()));
        }
    }

    /** 내가 등록한 상품 목록 조회 (구매만) **/
    public ResponseEntity<BaseResponse<List<ProductResponse>>> getMyRegisteredBuyProducts(String email) {
        try {
            List<Product> products = productMapper.findMyRegisteredBuyProducts(email); // `ProductWithImagesMap` 사용

            List<ProductResponse> productResponses = products.stream()
                    .map(this::convertToProductResponse) // 변환 로직 추가
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new BaseResponse<>(productResponses));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body(new BaseResponse<>(null, "내 등록 상품 조회 중 오류 발생: " + ex.getMessage()));
        }
    }

    /** 내가 등록한 상품 목록 조회 (판매만) **/
    public ResponseEntity<BaseResponse<List<ProductResponse>>> getMyRegisteredSellProducts(String email) {
        try {
            List<Product> products = productMapper.findMyRegisteredSellProducts(email);  // Product 객체 반환

            List<ProductResponse> productResponses = products.stream()
                    .map(this::convertToProductResponse) // ProductResponse로 변환
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new BaseResponse<>(productResponses));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body(new BaseResponse<>(null, "내 등록 상품 조회 중 오류 발생: " + ex.getMessage()));
        }
    }

    /** 내가 요청한 상품 목록 조회 (구매 요청만) **/
    public ResponseEntity<BaseResponse<List<ProductResponse>>> getMyRequestedBuyProducts(String email) {
        try {
            List<Product> products = productMapper.findMyRequestedBuyProducts(email);  // Product 객체 반환

            List<ProductResponse> productResponses = products.stream()
                    .map(this::convertToProductResponse) // ProductResponse로 변환
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new BaseResponse<>(productResponses));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body(new BaseResponse<>(null, "내 요청 상품 조회 중 오류 발생: " + ex.getMessage()));
        }
    }

    /** 사용자의 위치 기반으로 특정 반경 내(유동적 거리) 있는 상품을 조회 **/
    public ResponseEntity<BaseResponse<List<ProductResponse>>> getNearbyProducts(
            Double latitude,
            Double longitude,
            Double distance) {

        // 디버그 확인
        System.out.println("Received - latitude: " + latitude + ", longitude: " + longitude + ", distance: " + distance);

        // 필수 값 검증 (누락된 값이 있으면 즉시 반환)
        if (latitude == null || latitude == 0.0) {
            return ResponseEntity.badRequest().body(BaseResponse.error("위도 값이 누락되었습니다."));
        }
        if (longitude == null || longitude == 0.0) {
            return ResponseEntity.badRequest().body(BaseResponse.error("경도 값이 누락되었습니다."));
        }
        if (distance == null || distance == 0.0) {
            return ResponseEntity.badRequest().body(BaseResponse.error("거리 값이 누락되었습니다."));
        }

        // 모든 값이 정상적으로 들어왔을 때만 상품 검색 수행
        List<ProductResponse> products = productMapper.findNearbyProducts(latitude, longitude, distance);

        // 상품이 없을 때 200 OK + 메시지 반환
        if (products == null || products.isEmpty()) {
            return ResponseEntity.ok(BaseResponse.success(Collections.emptyList(), "주변에 검색된 상품이 없습니다. 거리 반경을 늘리거나, 등록 위치를 확인하세요."));
        }

        // 중복 제거를 위한 Map 사용
        Map<Long, ProductResponse> productMap = new HashMap<>();
        products.forEach(product -> productMap.putIfAbsent(product.getId(), product));

        // 이미지 리스트 및 썸네일 설정
        productMap.values().forEach(product -> {
            List<String> imagePaths = productImageMapper.findByProductId(product.getId())
                    .stream()
                    .map(image -> image.getImagePath())
                    .collect(Collectors.toList());

            product.setImagePaths(imagePaths);

            if (!imagePaths.isEmpty()) {
                product.setThumbnailPath(imagePaths.get(0));
            }
        });

        return ResponseEntity.ok(BaseResponse.success(List.copyOf(productMap.values()), "주변 상품 조회가 완료되었습니다."));
    }

    /** 내가 요청한 상품 목록 조회 (판매 요청만) **/
    public ResponseEntity<BaseResponse<List<ProductResponse>>> getMyRequestedSellProducts(String email) {
        try {
            List<Product> products = productMapper.findMyRequestedSellProducts(email);  // Product 객체 반환

            List<ProductResponse> productResponses = products.stream()
                    .map(this::convertToProductResponse) // ProductResponse로 변환
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new BaseResponse<>(productResponses));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body(new BaseResponse<>(null, "내 요청 상품 조회 중 오류 발생: " + ex.getMessage()));

        }


    }

    /** 
     * 상품 요청, 채팅방 생성, 알림 전송을 통합 처리하는 메소드
     * 세 가지 작업을 하나의 트랜잭션으로 일관성 있게 처리합니다.
     */
    @Transactional
    public ResponseEntity<BaseResponse<Map<String, Object>>> createProductRequestWithChatAndNotification(
            String requesterEmail, Long productId) {
        try {
            // 1. 상품 정보 및 등록자 확인
            String productOwnerEmail = productMapper.findEmailByProductId(productId);
            if (productOwnerEmail == null) {
                return ResponseEntity.badRequest()
                        .body(new BaseResponse<>(null, "해당 상품을 찾을 수 없습니다."));
            }

            // 2. 상품 요청 등록 및 관련 데이터 업데이트
            productMapper.insertProductRequest(productId, requesterEmail);
            productMapper.increaseCurrentParticipants(productId);
            productMapper.updateProductVisibility(productId);

            // 3. 채팅방 생성
            ChatRoomRequest chatRoomRequest = new ChatRoomRequest();
            chatRoomRequest.setProductId(productId);
            // optional: 채팅방 이름 설정
            // chatRoomRequest.setChatname("상품 문의");
            
            ChatRoomResponse chatResponse = chatService.createOrGetChatRoom(requesterEmail, chatRoomRequest);
            
            if (!chatResponse.isSuccess()) {
                throw new RuntimeException("채팅방 생성 실패: " + chatResponse.getMessage());
            }

            // 4. 알림 전송
            notificationService.sendNotification(productOwnerEmail, requesterEmail, productId);

            // 5. 상품 정보 가져오기
            Product product = productMapper.findById(productId, requesterEmail);
            if (product == null) {
                return ResponseEntity.internalServerError()
                        .body(new BaseResponse<>(null, "상품 요청은 저장되었지만, 상품 정보를 가져오는 데 실패했습니다."));
            }

            // 6. 모집 인원 충족 시 상태 업데이트
            if (product.getCurrentParticipants() >= product.getMaxParticipants()) {
                productMapper.updateRequestStatusToComplete(productId);
            }

            // 7. 응답 데이터 구성
            Map<String, Object> responseData = new HashMap<>();
            
            // 요청 정보
            Map<String, Object> requestInfo = new HashMap<>();
            requestInfo.put("productId", product.getId());
            requestInfo.put("requesterEmail", requesterEmail);
            requestInfo.put("status", "대기");
            requestInfo.put("approvalStatus", "미승인");
            requestInfo.put("requestType", product.getRegistrationType().equals("판매") ? "구매 요청" : "판매 요청");
            
            // 채팅방 정보
            responseData.put("requestInfo", requestInfo);
            responseData.put("chatInfo", chatResponse);
            responseData.put("productInfo", convertToProductResponse(product));

            return ResponseEntity.ok(new BaseResponse<>(responseData, "상품 요청 및 채팅방 생성이 완료되었습니다."));

        } catch (Exception ex) {
            log.error("통합 처리 중 오류 발생: {}", ex.getMessage());
            return ResponseEntity.internalServerError()
                    .body(new BaseResponse<>(null, "처리 중 오류 발생: " + ex.getMessage()));
        }
    }

    /** 상품 객체를 ProductResponse로 변환 **/
    private ProductResponse convertToProductResponse(Product product) {
        List<String> imageUrls = productImageMapper.findByProductId(product.getId()).stream()
                .map(image -> "/api/core/market/products/images/" + image.getId()) // 이미지 엔드포인트 반환
                .collect(Collectors.toList());

        // `days` JSON 문자열을 List<String>으로 변환
        List<String> daysList = null;
        if (product.getDays() != null) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                daysList = objectMapper.readValue(product.getDays(), new TypeReference<List<String>>() {});
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return ProductResponse.builder()
                .id(product.getId())
                .productCode(product.getProductCode())
                .title(product.getTitle())
                .description(product.getDescription())
                .price(product.getPrice())
                .email(product.getEmail())
                .categoryId(product.getCategoryId())
                .hobbyId(product.getHobbyId())
                .transactionType(product.getTransactionType())
                .registrationType(product.getRegistrationType())
                .maxParticipants(product.getMaxParticipants())
                .currentParticipants(product.getCurrentParticipants())
                .isVisible(product.isVisible())
                .startDate(product.getStartDate())
                .endDate(product.getEndDate())
                .latitude(product.getLatitude())
                .longitude(product.getLongitude())
                .meetingPlace(product.getMeetingPlace())
                .address(product.getAddress())
                .createdAt(product.getCreatedAt())
                .imagePaths(imageUrls)
                .thumbnailPath(imageUrls.isEmpty() ? null : imageUrls.get(0))
                .nickname(product.getNickname())
                .bio(product.getBio())
                .dopamine(product.getDopamine())
                .days(daysList)
                .build();
    }



}
