package com.example.demo.controller;

import com.example.demo.dto.response.*;
import com.example.demo.dto.profile.*;
import com.example.demo.dto.auth.*;
import com.example.demo.dto.hobby.*;
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

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.nio.file.Files;

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
    public ResponseEntity<ProfileImageResponse> uploadProfileImage(
            @RequestHeader("Authorization") String token,
            @RequestParam("file") MultipartFile file) {
        
        // 파일 기본 검증
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(ProfileImageResponse.builder()
                    .success(false)
                    .message("업로드할 파일이 비어있습니다.")
                    .build());
        }
        
        try {
            ProfileImageResponse response = userService.uploadProfileImageByToken(token, file);
            
            if (!response.isSuccess()) {
                return ResponseEntity.badRequest().body(response);
            }
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            // 파일 형식이나 크기 검증 실패 시
            return ResponseEntity.badRequest().body(ProfileImageResponse.builder()
                    .success(false)
                    .message(e.getMessage())
                    .build());
        } catch (Exception e) {
            log.error("이미지 업로드 중 예상치 못한 오류 발생: {}", e.getMessage());
            return ResponseEntity.status(500).body(ProfileImageResponse.builder()
                    .success(false)
                    .message("이미지 업로드 중 서버 오류가 발생했습니다.")
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
    public ResponseEntity<Resource> getProfileImage(@PathVariable String filename) {
        try {
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
                contentType = "application/octet-stream";
            }
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
            
        } catch (IOException ex) {
            log.error("프로필 이미지 로딩 실패: {}", ex.getMessage());
            return ResponseEntity.notFound().build();
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
    
    /**
     * 마이페이지 정보 조회
     */
    @GetMapping("/mypage")
    public ResponseEntity<ApiResponse<MyPageResponse>> getMyPageInfo(@RequestHeader("Authorization") String token) {
        MyPageResponse myPage = userService.getMyPageInfoByToken(token);
        
        if (!myPage.isSuccess()) {
            return ResponseEntity.badRequest().body(ApiResponse.error(myPage, "400"));
        }
        
        return ResponseEntity.ok(ApiResponse.success(myPage));
    }
    
    /**
     * 프로필 관리 - 프로필 상세 조회
     */
    @GetMapping("/manage")
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfileManageInfo(@RequestHeader("Authorization") String token) {
        // 기존의 내 프로필 조회 메서드 재사용 (완전한 프로필 정보 제공)
        ProfileResponse profile = userService.getUserProfileByToken(token);
        
        if (!profile.isSuccess()) {
            return ResponseEntity.badRequest().body(ApiResponse.error(profile, "400"));
        }
        
        return ResponseEntity.ok(ApiResponse.success(profile));
    }
    
    /**
     * 프로필 관리 - 프로필 정보 업데이트 (이름, 닉네임, 취미, 소개글만 변경 가능)
     */
    @PutMapping("/manage")
    public ResponseEntity<ApiResponse<ProfileUpdateResponse>> updateProfileManage(
            @RequestHeader("Authorization") String token,
            @RequestBody ProfileUpdateRequest request) {
        
        // 취미 정보의 기본 유효성 검증
        if (request.getHobbies() != null && !request.getHobbies().isEmpty()) {
            for (HobbyRequest hobby : request.getHobbies()) {
                if (hobby.getCategoryId() == null || hobby.getHobbyId() == null) {
                    Map<String, String> errorData = new HashMap<>();
                    errorData.put("message", "카테고리 또는 취미 정보가 누락되었습니다.");
                    return ResponseEntity.badRequest().body(ApiResponse.error(
                        new ProfileUpdateResponse(false, errorData.get("message"), null), "400"
                    ));
                }
            }
        }
        
        ProfileUpdateResponse response = userService.updateProfileByToken(token, request);
        
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(ApiResponse.error(response, "400"));
        }
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * 프로필 이미지 업로드 (프로필 관리에서 사용)
     */
    @PostMapping("/manage/image")
    public ResponseEntity<ApiResponse<ProfileImageResponse>> uploadProfileManageImage(
            @RequestHeader("Authorization") String token,
            @RequestParam("file") MultipartFile file) {
        
        // 파일 기본 검증
        if (file.isEmpty()) {
            ProfileImageResponse errorResponse = ProfileImageResponse.builder()
                    .success(false)
                    .message("업로드할 파일이 비어있습니다.")
                    .build();
            return ResponseEntity.badRequest().body(ApiResponse.error(errorResponse, "400"));
        }
        
        try {
            ProfileImageResponse response = userService.uploadProfileImageByToken(token, file);
            
            if (!response.isSuccess()) {
                return ResponseEntity.badRequest().body(ApiResponse.error(response, "400"));
            }
            
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            log.error("이미지 업로드 중 예상치 못한 오류 발생: {}", e.getMessage());
            ProfileImageResponse errorResponse = ProfileImageResponse.builder()
                    .success(false)
                    .message("이미지 업로드 중 서버 오류가 발생했습니다: " + e.getMessage())
                    .build();
            return ResponseEntity.status(500).body(ApiResponse.error(errorResponse, "500"));
        }
    }
    
    /**
     * 프로필 이미지 삭제 (프로필 관리에서 사용)
     */
    @DeleteMapping("/manage/image")
    public ResponseEntity<ApiResponse<ProfileImageResponse>> deleteProfileManageImage(
            @RequestHeader("Authorization") String token) {
        
        ProfileImageResponse response = userService.deleteProfileImageByToken(token);
        
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(ApiResponse.error(response, "400"));
        }
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
