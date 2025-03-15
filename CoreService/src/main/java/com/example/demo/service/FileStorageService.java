package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import jakarta.annotation.PostConstruct;

@Service
@Slf4j
public class FileStorageService {

    // 프로필 이미지 저장 경로를 리소스의 static 폴더 내 profile-images 디렉토리로 변경
    private final String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/profile-images";
    
    @Value("${file.default-profile-image}")
    private String defaultProfileImage;
    
    @Value("${file.max-size:10485760}") // 기본값 10MB
    private long maxFileSize;
    
    private final Set<String> ALLOWED_EXTENSIONS = new HashSet<>(
        Arrays.asList(".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp")
    );
    
    private Path fileStorageLocation;

    @PostConstruct
    public void init() {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
            log.info("프로필 이미지 저장 디렉토리 생성 완료: {}", this.fileStorageLocation);
            createDefaultProfileImageIfNotExists();
        } catch (IOException ex) {
            throw new RuntimeException("프로필 이미지 저장 디렉토리를 생성할 수 없습니다.", ex);
        }
    }

    /**
     * 프로필 이미지 파일을 저장하고 저장된 경로를 반환합니다.
     */
    public String storeProfileImage(MultipartFile file, String userEmail) {
        try {
            if (file.isEmpty()) {
                log.warn("저장할 파일이 비어 있습니다.");
                return null;
            }
            
            // 파일 크기 검증
            if (file.getSize() > maxFileSize) {
                log.warn("파일 크기 초과: {} (최대 허용: {})", file.getSize(), maxFileSize);
                throw new IllegalArgumentException("파일 크기가 제한을 초과합니다. 최대 " + (maxFileSize / 1048576) + "MB까지 허용됩니다.");
            }
            
            // 파일명 충돌 방지를 위해 UUID와 이메일 조합으로 새 파일명 생성
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
                
                // 파일 확장자 검증
                if (!ALLOWED_EXTENSIONS.contains(fileExtension)) {
                    log.warn("허용되지 않는 파일 형식: {}", fileExtension);
                    throw new IllegalArgumentException("허용되지 않는 파일 형식입니다. 지원되는 형식: " + ALLOWED_EXTENSIONS);
                }
            } else {
                throw new IllegalArgumentException("유효한 파일 이름이 아닙니다.");
            }
            
            String newFilename = userEmail.split("@")[0] + "_" + UUID.randomUUID() + fileExtension;
            Path targetLocation = this.fileStorageLocation.resolve(newFilename);
            
            // 파일 저장
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            log.info("프로필 이미지 저장 성공: {}", targetLocation);
            
            return newFilename;
        } catch (IOException ex) {
            log.error("프로필 이미지 저장 중 오류 발생: {}", ex.getMessage());
            throw new RuntimeException("프로필 이미지 저장 중 오류가 발생했습니다.", ex);
        }
    }
    
    /**
     * 기존 프로필 이미지를 삭제합니다.
     */
    public void deleteProfileImage(String filename) {
        if (filename != null && !filename.equals(defaultProfileImage)) {
            try {
                Path file = this.fileStorageLocation.resolve(filename);
                Files.deleteIfExists(file);
                log.info("프로필 이미지 삭제 성공: {}", file);
            } catch (IOException ex) {
                log.error("프로필 이미지 삭제 중 오류 발생: {}", ex.getMessage());
            }
        }
    }
    
    /**
     * 프로필 이미지 파일의 전체 경로를 가져옵니다.
     */
    public Path getProfileImagePath(String filename) {
        if (filename == null || filename.isEmpty()) {
            filename = defaultProfileImage;
        }
        return this.fileStorageLocation.resolve(filename);
    }
    
    /**
     * 기본 프로필 이미지를 생성합니다.
     */
    public void createDefaultProfileImageIfNotExists() {
        Path defaultImagePath = this.fileStorageLocation.resolve(defaultProfileImage);
        if (!Files.exists(defaultImagePath)) {
            try {
                // 애플리케이션 리소스에서 기본 이미지 복사 시도
                try {
                    Path resourcePath = Paths.get(getClass().getResource("/static/images/default-profile.jpeg").toURI());
                    Files.copy(resourcePath, defaultImagePath, StandardCopyOption.REPLACE_EXISTING);
                    log.info("기본 프로필 이미지 파일 생성 완료: {}", defaultImagePath);
                } catch (Exception e) {
                    log.error("기본 프로필 이미지 생성 실패: {}", e.getMessage());
                    log.warn("기본 이미지를 찾을 수 없어 빈 파일을 생성합니다.");
                    Files.createFile(defaultImagePath);
                    log.info("빈 기본 프로필 이미지 파일 생성: {}", defaultImagePath);
                }
            } catch (IOException ioe) {
                log.error("빈 기본 프로필 이미지 생성 실패: {}", ioe.getMessage());
            }
        }
    }

    /**
     * 기본 프로필 이미지 파일명을 반환합니다.
     */
    public String getDefaultProfileImageName() {
        return defaultProfileImage;
    }
}
