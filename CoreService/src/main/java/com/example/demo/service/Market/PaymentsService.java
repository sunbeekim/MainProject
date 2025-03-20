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
public class PaymentsService {

    private final PaymentsMapper paymentsMapper;
    private final TransactionsMapper transactionsMapper;

    public ResponseEntity<BaseResponse<PaymentsResponse>> createPayment(PaymentsRequest request) {
        paymentsMapper.insertPayment(request);
        return ResponseEntity.ok(new BaseResponse<>(null,"결제가 성공적으로 처리되었습니다."));
    }

    public ResponseEntity<BaseResponse<List<PaymentsResponse>>> getPaymentsByTransaction(Long transactionId) {
        List<PaymentsResponse> payments = paymentsMapper.findPaymentsByTransaction(transactionId);
        return ResponseEntity.ok(new BaseResponse<>(payments));
    }

    public ResponseEntity<BaseResponse<String>> updatePaymentStatus(Long id) {
        int totalPaid = paymentsMapper.getTotalPaidByTransaction(id);
        int transactionPrice = transactionsMapper.getTransactionPrice(id);

        if (totalPaid >= transactionPrice) {
            transactionsMapper.updateTransactionPaymentStatus(id, "완료");
            return ResponseEntity.ok(new BaseResponse<>("결제가 완료되었습니다."));
        }
        return ResponseEntity.ok(new BaseResponse<>("결제가 아직 완료되지 않았습니다."));
    }
}
