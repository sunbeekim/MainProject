package com.example.demo.mapper.Market;

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
}
