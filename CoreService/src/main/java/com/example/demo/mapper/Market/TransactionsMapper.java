package com.example.demo.mapper.Market;

import com.example.demo.dto.Market.TransactionsRequest;
import com.example.demo.dto.Market.TransactionsResponse;
import com.example.demo.model.Market.Transaction;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TransactionsMapper {
    void insertTransaction(TransactionsRequest request);
    TransactionsResponse findTransactionById(@Param("id") Long id);
    List<TransactionsResponse> findTransactionsByUser(@Param("email") String email);
    void updateTransactionStatus(@Param("id") Long id, @Param("status") String status);
    int getTransactionPrice(@Param("id") Long id);
    void updateTransactionPaymentStatus(@Param("id") Long id, @Param("status") String status);
}