package com.example.demo.mapper.Market;

import com.example.demo.model.Market.ProductRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface ProductRequestMapper {
    
    /**
     * 상품 ID와 요청자 이메일로 요청 정보 조회
     */
    ProductRequest findByProductIdAndRequesterEmail(
        @Param("productId") Long productId, 
        @Param("requesterEmail") String requesterEmail);
    
    /**
     * 상품 ID와 요청자 이메일로 요청 ID 조회
     */
    Long findRequestId(
        @Param("productId") Long productId, 
        @Param("requesterEmail") String requesterEmail);
}
