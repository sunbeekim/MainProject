package com.example.demo.controller.Market;

import com.example.demo.dto.Market.TransactionsRequest;
import com.example.demo.dto.Market.TransactionsResponse;
import com.example.demo.dto.Market.PaymentsRequest;
import com.example.demo.dto.Market.PaymentsResponse;
import com.example.demo.service.Market.TransactionsService;
import com.example.demo.service.Market.PaymentsService;
import com.example.demo.util.BaseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/core/market")
@RequiredArgsConstructor
public class TransactionsController {

    private final TransactionsService transactionsService;
    private final PaymentsService paymentsService;

    /** 거래 생성 **/
    @PostMapping("/transactions")
    public ResponseEntity<BaseResponse<TransactionsResponse>> createTransaction(
            @RequestBody TransactionsRequest request) {
        return transactionsService.createTransaction(request);
    }

    /** 특정 거래 상세 조회 **/
    @GetMapping("/transactions/{id}")
    public ResponseEntity<BaseResponse<TransactionsResponse>> getTransactionById(@PathVariable Long id) {
        return transactionsService.getTransactionById(id);
    }

    /** 사용자별 거래 내역 조회 **/
    @GetMapping("/transactions/user")
    public ResponseEntity<BaseResponse<List<TransactionsResponse>>> getUserTransactions(@RequestParam String email) {
        return transactionsService.getUserTransactions(email);
    }

    /** 거래 상태 변경 (완료/취소) **/
    @PatchMapping("/transactions/{id}")
    public ResponseEntity<BaseResponse<String>> updateTransactionStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return transactionsService.updateTransactionStatus(id, status);
    }

    /** 결제 요청 **/
    @PostMapping("/payments")
    public ResponseEntity<BaseResponse<PaymentsResponse>> createPayment(@RequestBody PaymentsRequest request) {
        return paymentsService.createPayment(request);
    }

    /** 특정 거래의 결제 내역 조회 **/
    @GetMapping("/payments/{transactionId}")
    public ResponseEntity<BaseResponse<List<PaymentsResponse>>> getPaymentsByTransaction(@PathVariable Long transactionId) {
        return paymentsService.getPaymentsByTransaction(transactionId);
    }

    /** 결제 완료 여부 확인 후 거래 상태 변경 **/
    @PatchMapping("/transactions/{id}/payment/status")
    public ResponseEntity<BaseResponse<String>> updatePaymentStatus(@PathVariable Long id) {
        return paymentsService.updatePaymentStatus(id);
    }
}
