package com.example.demo.controller;

import com.example.demo.serviceimpl.CloudOCRServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.demo.dto.CommonResponseDTO;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/assist/cloudocr")
public class CloudOCRController {

    private final CloudOCRServiceImpl cloudOCRServiceImpl;

    @PostMapping("/process")
    public ResponseEntity<CommonResponseDTO> processImage(
            @RequestParam("file") MultipartFile file) {
        System.out.println("CloudOCRController processImage");
        try {
            String result = cloudOCRServiceImpl.processImage(file);
            return ResponseEntity.ok(CommonResponseDTO.builder()
                .status("success")
                .data(new CommonResponseDTO.Data(result, ""))
                .code("200")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(CommonResponseDTO.builder()
                .status("error")
                .data(new CommonResponseDTO.Data("이미지 처리 중 오류가 발생했습니다.", e.getMessage()))
                .code("500")
                .build());
        }
    }
}
