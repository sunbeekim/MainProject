// http://localhost:8081 — 구현 해야하는 code서버 (백엔드 DB, redis, 웹소켓)

package com.example.demo.controller;

import com.example.demo.dto.MarketServiceRequest;
import com.example.demo.dto.MarketServiceResponse;
import com.example.demo.service.MarketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/core/market")
@RequiredArgsConstructor
public class MarketController {

    private final MarketService marketService;

    @PostMapping("/create")
    public ResponseEntity<String> createService(@RequestBody MarketServiceRequest request) {
        marketService.createService(request);
        return ResponseEntity.ok("등록한 상품이 생성 되었습니다.");
    }

    @GetMapping("/{serviceId}")
    public ResponseEntity<MarketServiceResponse> getServiceById(@PathVariable Long serviceId) {
        return ResponseEntity.ok(marketService.getServiceById(serviceId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<MarketServiceResponse>> getAllServices() {
        return ResponseEntity.ok(marketService.getAllServices());
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateService(@RequestBody MarketServiceResponse response) {
        marketService.updateService(response);
        return ResponseEntity.ok("등록 된 상품이 갱신되었습니다.");
    }

    @DeleteMapping("/delete/{serviceId}")
    public ResponseEntity<String> deleteService(@PathVariable Long serviceId) {
        marketService.deleteService(serviceId);
        return ResponseEntity.ok("등록된 상품이 삭제되었습니다.");
    }
}
