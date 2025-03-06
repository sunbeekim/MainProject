package com.example.demo.mapper;

import com.example.demo.model.Category;
import com.example.demo.model.Hobby;
import com.example.demo.model.UserHobby;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface HobbyMapper {
    
    // 모든 취미 목록 조회
    List<Hobby> getAllHobbies();
    
    // 취미 ID로 취미 조회
    Hobby getHobbyById(Long hobbyId);
    
    /**
     * 취미 ID로 카테고리 목록 조회
     * @deprecated 카테고리 우선 선택 방식으로 변경됨
     */
    @Deprecated
    List<Category> getCategoriesByHobbyId(Long hobbyId);
    
    // 모든 카테고리 목록 조회
    List<Category> getAllCategories();
    
    // 사용자의 취미 추가
    void insertUserHobby(UserHobby userHobby);
    
    // 사용자의 모든 취미 조회
    List<UserHobby> getUserHobbies(String email);
    
    // 취미가 특정 카테고리에 속하는지 확인
    boolean isHobbyInCategory(@Param("hobbyId") Long hobbyId, @Param("categoryId") Long categoryId);
    
    // 사용자의 특정 취미 삭제
    void deleteUserHobby(@Param("email") String email, @Param("hobbyId") Long hobbyId);
    
    // 사용자의 모든 취미 삭제
    void deleteAllUserHobbies(String email);
    
    // 카테고리 ID로 취미 목록 조회 (추가)
    List<Hobby> getHobbiesByCategoryId(Long categoryId);
}
