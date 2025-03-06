package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.service.FileStorageService;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.demo.dto.CommonResponseDTO;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.nio.file.Files;
import java.util.Base64;

@RestController
@RequestMapping("/api/core/profiles")
@RequiredArgsConstructor
@Slf4j
public class ProfileController {
    
    private final UserService userService;
    private final FileStorageService fileStorageService;
    
    /**
     * 자신의 프로필 조회
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<ProfileResponse>> getMyProfile(@RequestHeader("Authorization") String token) {
        ProfileResponse profile = userService.getUserProfileByToken(token);
        
        if (!profile.isSuccess()) {
            return ResponseEntity.badRequest().body(ApiResponse.error(profile, "400"));
        }
        
        return ResponseEntity.ok(ApiResponse.success(profile));
    }
    
    /**
     * 닉네임으로 다른 사용자의 프로필 조회 (공개 정보만)
     */
    @GetMapping("/user/{nickname}")
    public ResponseEntity<ApiResponse<ProfileResponse>> getUserProfile(@PathVariable String nickname) {
        ProfileResponse profile = userService.getPublicProfile(nickname);
        
        if (!profile.isSuccess()) {
            return ResponseEntity.badRequest().body(ApiResponse.error(profile, "400"));
        }
        
        return ResponseEntity.ok(ApiResponse.success(profile));
    }
    
    /**
     * 이메일로 사용자 프로필 조회 (관리자 기능)
     */
    @GetMapping("/admin/user/{email}")
    public ResponseEntity<ProfileResponse> getAdminUserProfile(
            @RequestHeader("Authorization") String token,
            @PathVariable String email) {
        
        // 주의: 실제 구현에서는 여기에 관리자 권한 검증 필요
        ProfileResponse profile = userService.getUserProfile(email);
        
        if (!profile.isSuccess()) {
            return ResponseEntity.badRequest().body(profile);
        }
        
        return ResponseEntity.ok(profile);
    }
    
    /**
     * 자신의 프로필 수정
     */
    @PutMapping("/me")
    public ResponseEntity<ProfileUpdateResponse> updateMyProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody ProfileUpdateRequest request) {
        
        // 취미 정보의 기본 유효성 검증 (선택적)
        if (request.getHobbies() != null && !request.getHobbies().isEmpty()) {
            for (HobbyRequest hobby : request.getHobbies()) {
                if (hobby.getCategoryId() == null || hobby.getHobbyId() == null) {
                    return ResponseEntity.badRequest().body(
                        ProfileUpdateResponse.builder()
                            .success(false)
                            .message("카테고리 또는 취미 정보가 누락되었습니다.")
                            .build()
                    );
                }
            }
        }
        
        ProfileUpdateResponse response = userService.updateProfileByToken(token, request);
        
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 비밀번호 변경
     */
    @PutMapping("/me/password")
    public ResponseEntity<PasswordChangeResponse> changePassword(
            @RequestHeader("Authorization") String token,
            @RequestBody PasswordChangeRequest request) {
        
        PasswordChangeResponse response = userService.changePasswordByToken(token, request);
        
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 프로필 이미지 업로드
     */
    @PostMapping("/me/image")
    public ResponseEntity<CommonResponseDTO<String>> uploadProfileImage(
            @RequestHeader("Authorization") String token,
            @RequestParam("file") MultipartFile file) {
        
        // 파일 기본 검증
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(CommonResponseDTO.<String>builder()
                    .status("error")
                    .data(CommonResponseDTO.Data.<String>builder()
                        .message("업로드할 파일이 비어있습니다.")
                        .response("")
                        .build())
                    .code("400")
                    .build());
        }
        
        try {
            ProfileImageResponse response = userService.uploadProfileImageByToken(token, file);
            
            if (!response.isSuccess()) {
                return ResponseEntity.badRequest().body(CommonResponseDTO.<String>builder()
                        .status("error")
                        .data(CommonResponseDTO.Data.<String>builder()
                            .message(response.getMessage())
                            .response("")
                            .build())
                        .code("400")
                        .build());
            }
            
            return ResponseEntity.ok(CommonResponseDTO.<String>builder()
                    .status("success")
                    .data(CommonResponseDTO.Data.<String>builder()
                        .message(response.getMessage())
                        .response("")
                        .build())
                    .code("200")
                    .build());
        } catch (IllegalArgumentException e) {
            // 파일 형식이나 크기 검증 실패 시
                return ResponseEntity.badRequest().body(CommonResponseDTO.<String>builder()
                    .status("error")
                    .data(CommonResponseDTO.Data.<String>builder()
                        .message(e.getMessage())
                        .response("")
                        .build())
                    .code("400")
                    .build());
        } catch (Exception e) {
            log.error("이미지 업로드 중 예상치 못한 오류 발생: {}", e.getMessage());
            return ResponseEntity.status(500).body(CommonResponseDTO.<String>builder()
                    .status("error")
                    .data(CommonResponseDTO.Data.<String>builder()
                        .message(e.getMessage())
                        .response("")
                        .build())
                    .code("500")
                    .build());
        }
    }
    
    /**
     * 프로필 이미지 삭제
     */
    @DeleteMapping("/me/image")
    public ResponseEntity<ProfileImageResponse> deleteProfileImage(
            @RequestHeader("Authorization") String token) {
        
        ProfileImageResponse response = userService.deleteProfileImageByToken(token);
        
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 프로필 이미지 조회 (자신)
     */
    @GetMapping("/me/image-info")
    public ResponseEntity<?> getMyProfileImageInfo(

            @RequestHeader("Authorization") String token) {
        
        String tokenWithoutBearer = token;
        if (token.startsWith("Bearer ")) {
            tokenWithoutBearer = token.substring(7);
        }
        
        if (!userService.tokenUtils.isTokenValid(tokenWithoutBearer)) {
            Map<String, String> errorData = new HashMap<>();
            errorData.put("message", "유효하지 않은 인증 토큰입니다.");
            return ResponseEntity.badRequest().body(ApiResponse.error(errorData, "400"));
        }
        
        String email = userService.tokenUtils.getEmailFromToken(tokenWithoutBearer);
        String imageUrl = userService.getProfileImageUrl(email);
        
        Map<String, String> responseData = new HashMap<>();
        responseData.put("imageUrl", imageUrl);
        

        return ResponseEntity.ok(ApiResponse.success(responseData));
    }
    
    /**
     * 프로필 이미지 파일 제공 
     */
    @GetMapping("/image/{filename:.+}")
    public ResponseEntity<CommonResponseDTO<Map<String, String>>> getProfileImage(@PathVariable String filename) {
        try {
            System.out.println("getProfileImage 호출됨");
            Path filePath = fileStorageService.getProfileImagePath(filename);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (!resource.exists()) {
                // 요청한 이미지가 없으면 기본 이미지 반환
                filePath = fileStorageService.getProfileImagePath(null);
                resource = new UrlResource(filePath.toUri());
            }
            
            // 파일 타입 확인
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "image/*";
            }
            
            // 리소스를 바이트 배열로 변환
            byte[] imageBytes = Files.readAllBytes(filePath);
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            
            Map<String, String> responseData = new HashMap<>();
            responseData.put("contentType", contentType);
            responseData.put("filename", resource.getFilename());
            responseData.put("imageData", base64Image);
            
            return ResponseEntity.ok(CommonResponseDTO.<Map<String, String>>builder()
                    .status("success")
                    .data(CommonResponseDTO.Data.<Map<String, String>>builder()
                        .message(resource.getFilename())
                        .response(responseData)
                        .build())
                    .code("200")
                    .build());
            
        } catch (IOException ex) {
            log.error("프로필 이미지 로딩 실패: {}", ex.getMessage());
            return ResponseEntity.badRequest().body(CommonResponseDTO.<Map<String, String>>builder()
                    .status("error")
                    .data(CommonResponseDTO.Data.<Map<String, String>>builder()
                        .message(ex.getMessage())
                        .response(null)
                        .build())
                    .code("400")
                    .build());
        }
    }
    
    /**
     * 기본 프로필 이미지 반환
     */
    @GetMapping("/image/default")
    public ResponseEntity<Resource> getDefaultProfileImage() {
        try {
            Path filePath = fileStorageService.getProfileImagePath(null);
            Resource resource = new UrlResource(filePath.toUri());
            
            // 파일 타입 확인
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
            
        } catch (IOException ex) {
            log.error("기본 프로필 이미지 로딩 실패: {}", ex.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}
