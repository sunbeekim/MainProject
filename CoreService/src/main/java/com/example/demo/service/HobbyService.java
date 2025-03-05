package com.example.demo.service;

import com.example.demo.dto.HobbyRequest;
import com.example.demo.mapper.HobbyMapper;
import com.example.demo.model.Category;
import com.example.demo.model.Hobby;
import com.example.demo.model.UserHobby;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class HobbyService {

    private final HobbyMapper hobbyMapper;

    /**
     * 모든 취미 목록을 조회합니다.
     */
    public List<Hobby> getAllHobbies() {
        return hobbyMapper.getAllHobbies();
    }

    /**
     * 모든 취미와 그에 해당하는 카테고리 목록을 조회합니다.
     */
    public List<Hobby> getAllHobbiesWithCategories() {
        List<Hobby> hobbies = hobbyMapper.getAllHobbies();
        
        // 각 취미에 해당하는 카테고리 목록을 설정
        for (Hobby hobby : hobbies) {
            List<Category> categories = hobbyMapper.getCategoriesByHobbyId(hobby.getHobbyId());
            hobby.setCategories(categories);
        }
        
        return hobbies;
    }
    
    /**
     * 취미 ID로 취미를 조회합니다.
     */
    public Hobby getHobbyById(Long hobbyId) {
        return hobbyMapper.getHobbyById(hobbyId);
    }

    /**
     * 취미 ID로 해당 취미에 속한 카테고리 목록을 조회합니다.
     */
    public List<Category> getCategoriesByHobbyId(Long hobbyId) {
        return hobbyMapper.getCategoriesByHobbyId(hobbyId);
    }

    /**
     * 모든 카테고리 목록을 조회합니다.
     */
    public List<Category> getAllCategories() {
        return hobbyMapper.getAllCategories();
    }

    /**
     * 사용자의 취미 목록을 조회합니다.
     */
    public List<UserHobby> getUserHobbies(String email) {
        return hobbyMapper.getUserHobbies(email);
    }

    /**
     * 사용자의 취미를 등록합니다.
     * @throws IllegalArgumentException 선택한 취미가 해당 카테고리에 속하지 않는 경우
     */
    @Transactional
    public void registerUserHobby(String email, Long hobbyId, Long categoryId) {
        // 취미가 해당 카테고리에 속하는지 확인
        boolean isValid = hobbyMapper.isHobbyInCategory(hobbyId, categoryId);
        if (!isValid) {
            throw new IllegalArgumentException(
                "선택한 취미(ID: " + hobbyId + ")가 해당 카테고리(ID: " + categoryId + ")에 속하지 않습니다."
            );
        }
        
        UserHobby userHobby = UserHobby.builder()
                .email(email)
                .hobbyId(hobbyId)
                .categoryId(categoryId)
                .build();
        
        hobbyMapper.insertUserHobby(userHobby);
        log.info("사용자 취미 등록 완료 - 이메일: {}, 취미ID: {}, 카테고리ID: {}", email, hobbyId, categoryId);
    }

    /**
     * 사용자의 여러 취미를 등록합니다.
     */
    @Transactional
    public void registerUserHobbies(String email, List<HobbyRequest> hobbies) {
        if (hobbies == null || hobbies.isEmpty()) {
            log.info("등록할 취미가 없습니다 - 이메일: {}", email);
            return;
        }

        // 기존 취미 모두 삭제
        hobbyMapper.deleteAllUserHobbies(email);
        
        // 새로운 취미 등록
        for (HobbyRequest hobby : hobbies) {
            try {
                registerUserHobby(email, hobby.getHobbyId(), hobby.getCategoryId());
            } catch (Exception e) {
                log.error("취미 등록 실패 - 이메일: {}, 취미ID: {}, 카테고리ID: {}, 오류: {}", 
                          email, hobby.getHobbyId(), hobby.getCategoryId(), e.getMessage());
            }
        }
    }
}
