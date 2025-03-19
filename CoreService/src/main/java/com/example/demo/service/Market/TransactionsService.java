package com.example.demo.service.Market;

import com.example.demo.dto.Market.TransactionsRequest;
import com.example.demo.dto.Market.TransactionsResponse;
import com.example.demo.dto.Market.PaymentsRequest;
import com.example.demo.dto.Market.PaymentsResponse;
import com.example.demo.mapper.Market.TransactionsMapper;
import com.example.demo.mapper.Market.PaymentsMapper;
import com.example.demo.util.BaseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionsService {

    private final TransactionsMapper transactionsMapper;

    public ResponseEntity<BaseResponse<TransactionsResponse>> createTransaction(TransactionsRequest request) {
        transactionsMapper.insertTransaction(request);
        Long transactionId = request.getId(); // 저장된 거래 ID 가져오기
        TransactionsResponse transaction = transactionsMapper.findTransactionById(transactionId);
        return ResponseEntity.ok(new BaseResponse<>(null,"거래가 생성되었습니다."));
    }

    public ResponseEntity<BaseResponse<TransactionsResponse>> getTransactionById(Long id) {
        TransactionsResponse transaction = transactionsMapper.findTransactionById(id);
        return ResponseEntity.ok(new BaseResponse<>(transaction));
    }

    public ResponseEntity<BaseResponse<List<TransactionsResponse>>> getUserTransactions(String email) {
        List<TransactionsResponse> transactions = transactionsMapper.findTransactionsByUser(email);
        return ResponseEntity.ok(new BaseResponse<>(transactions));
    }

    public ResponseEntity<BaseResponse<String>> updateTransactionStatus(Long id, String status) {
        transactionsMapper.updateTransactionStatus(id, status);
        return ResponseEntity.ok(new BaseResponse<>("거래 상태가 업데이트되었습니다."));
    }
}