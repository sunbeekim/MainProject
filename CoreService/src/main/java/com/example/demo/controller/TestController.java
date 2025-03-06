package com.example.demo.controller;

import com.example.demo.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/core/test")
public class TestController {

    @GetMapping("/hello")
    public ResponseEntity<ApiResponse<Map<String, String>>> hello() {
        Map<String, String> responseData = new HashMap<>();
        responseData.put("message", "Hello from Core Service!");
        return ResponseEntity.ok(ApiResponse.success(responseData));
    }

    @PostMapping("/echo")
    public ResponseEntity<ApiResponse<Map<String, Object>>> echo(@RequestBody Map<String, Object> request) {
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("message", "Echo from Core Service");
        responseData.put("receivedData", request);
        responseData.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(ApiResponse.success(responseData));
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, String>>> healthCheck() {
        Map<String, String> status = new HashMap<>();
        status.put("service", "Core Service");
        status.put("status", "UP");
        status.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(ApiResponse.success(status));
    }
}
