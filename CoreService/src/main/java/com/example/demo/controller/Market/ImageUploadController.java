package com.example.demo.controller.Market;

import com.example.demo.service.Market.ImageUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.demo.security.JwtTokenProvider;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/core/market/images")
@CrossOrigin("*")
@RequiredArgsConstructor
public class ImageUploadController {
    private final ImageUploadService imageUploadService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/upload")
    public ResponseEntity<Object> uploadImages(   
            @RequestHeader("Authorization") String token,
            @RequestParam("productId") Long productId,
            @RequestParam("files") List<MultipartFile> files) {   

        String jwtToken = token.replace("Bearer ", "");
        String email = jwtTokenProvider.getUsername(jwtToken);
        System.out.println("email: " + email);
        System.out.println("productId: " + productId);
        
        // 필수 값 검증 (email, productId)
        if (email == null || email.isEmpty() || productId == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", 400,
                    "error", "Bad Request",
                    "message", "필수 요청 값이 없습니다. (email, productId)"
            ));
        }

        // 파일 검증
        if (files == null || files.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", 400,
                    "error", "Bad Request",
                    "message", "업로드된 파일이 없습니다."
            ));
        }

        return imageUploadService.uploadProductImages(email, productId, files);
    }
}
