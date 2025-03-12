package com.example.demo.mapper.Market;

import com.example.demo.dto.Market.ProductResponse;
import com.example.demo.model.Market.Product;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface ProductMapper {
    void insertProduct(Product product);
    Product findById(Long id);

    // 정렬 추가
    List<Product> findAll(@Param("sort") String sort);

    // 특정 카테고리 필터링 + 정렬 추가
    List<Product> findFilteredProducts(@Param("categoryId") Long categoryId, @Param("sort") String sort);

    // 사용자(이메일)가 등록한 상품별 목록 조회 추가 (구매, 판매, 구매 요청, 판매 요청)
    List<ProductResponse> findProductsByEmailAndType(@Param("email") String email, @Param("types") List<String> types);
}
