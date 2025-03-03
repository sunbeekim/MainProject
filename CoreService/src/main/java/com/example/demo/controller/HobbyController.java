package com.example.demo.controller;

import com.example.demo.dto.HobbyRequest;
import com.example.demo.model.Category;
import com.example.demo.model.Hobby;
import com.example.demo.model.UserHobby;
import com.example.demo.security.JwtTokenProvider;
import com.example.demo.service.HobbyService;
import com.example.demo.util.TokenUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/core/hobbies")
@RequiredArgsConstructor
@Slf4j
public class HobbyController {

    private final HobbyService hobbyService;
    private final TokenUtils tokenUtils;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 모든 취미 목록 조회 (카테고리 정보 포함)
     */
    @GetMapping
    public ResponseEntity<List<Hobby>> getAllHobbies() {
        List<Hobby> hobbies = hobbyService.getAllHobbiesWithCategories();
        return ResponseEntity.ok(hobbies);
    }

    /**
     * 모든 카테고리 목록 조회
     */
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = hobbyService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    /**
     * 특정 취미에 속한 카테고리 목록 조회
     */
    @GetMapping("/{hobbyId}/categories")
    public ResponseEntity<List<Category>> getCategoriesByHobbyId(@PathVariable Long hobbyId) {
        List<Category> categories = hobbyService.getCategoriesByHobbyId(hobbyId);
        return ResponseEntity.ok(categories);
    }

    /**
     * 사용자의 취미 목록 조회
     */
    @GetMapping("/user")
    public ResponseEntity<?> getUserHobbies(@RequestHeader("Authorization") String token) {
        String tokenWithoutBearer = tokenUtils.extractTokenWithoutBearer(token);
        
        if (!tokenUtils.isTokenValid(tokenWithoutBearer)) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "인증되지 않은 요청입니다.");
            return ResponseEntity.status(401).body(response);
        }
        
        String email = jwtTokenProvider.getUsername(tokenWithoutBearer);
        List<UserHobby> userHobbies = hobbyService.getUserHobbies(email);
        return ResponseEntity.ok(userHobbies);
    }

    /**
     * 사용자의 취미 등록/수정
     */
    @PostMapping("/user")
    public ResponseEntity<?> updateUserHobbies(
            @RequestHeader("Authorization") String token,
            @RequestBody List<HobbyRequest> hobbies) {
        
        String tokenWithoutBearer = tokenUtils.extractTokenWithoutBearer(token);
        
        if (!tokenUtils.isTokenValid(tokenWithoutBearer)) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "인증되지 않은 요청입니다.");
            return ResponseEntity.status(401).body(response);
        }
        
        String email = jwtTokenProvider.getUsername(tokenWithoutBearer);
        
        try {
            hobbyService.registerUserHobbies(email, hobbies);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "취미 정보가 업데이트되었습니다.");
            response.put("count", hobbies.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("취미 업데이트 중 오류 발생: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "취미 정보 업데이트 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}