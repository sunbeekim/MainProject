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
    List<Product> findAll();
    List<Product> findByCategory(@Param("categoryId") Long categoryId);  // 특정 카테고리 상품 조회
}