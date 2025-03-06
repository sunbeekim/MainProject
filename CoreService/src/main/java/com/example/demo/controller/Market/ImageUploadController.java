package com.example.demo.controller.Market;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/core/market/images")
@CrossOrigin("*") // CORS 문제 방지
public class ImageUploadController {

    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping("/upload")
    public ResponseEntity<Object> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "status", 400,
                        "message", "업로드된 파일이 없습니다."
                ));
            }

            System.out.println("파일 업로드 요청 받음: " + file.getOriginalFilename()); // 로그 추가

            // 업로드 폴더 생성
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // 파일 저장
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR, fileName);
            file.transferTo(filePath);

            //저장된 파일 URL 생성

            String imageUrl = "http://localhost:8081/api/core/market/images/uploads/" + fileName;

            return ResponseEntity.ok().body(Map.of(
                    "status", 200,
                    "message", "이미지가 성공적으로 업로드되었습니다.",
                    "imagePath", imageUrl
            ));
        } catch (IOException e) {
            System.out.println("이미지 업로드 중 오류 발생: " + e.getMessage()); // 오류 로그 추가
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", 500,
                    "message", "이미지 업로드 중 오류 발생",
                    "error", e.getMessage()
            ));
        }
    }
}
