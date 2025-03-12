package com.example.demo.mapper.Market;

import com.example.demo.model.Market.ProductImage;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface ProductImageMapper {
    void insertProductImage(ProductImage productImage);
    List<ProductImage> findByProductId(Long productId);
}