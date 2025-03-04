package com.example.demo.mapper.Market;

import com.example.demo.model.Market.Product;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface ProductMapper {
    void insertProduct(Product product);
    Product findById(Long id);
    List<Product> findAll();
}