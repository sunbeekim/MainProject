package com.example.demo.mapper;

// MyBatis 사용 및 SQL 실행 할 인터페이스 매퍼


import com.example.demo.model.UserLogin;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserLoginMapper {

    UserLogin findByUsername(@Param("username") String username); // 로그인할 사용자 찾기
    UserLogin findByUserLoginId(@Param("userLoginId") Long userLoginId);
    void updateLoginFailedAttempts(@Param("userLoginId") Long userLoginId, @Param("failedAttempts") int failedAttempts); // 로그인 실패 횟수 업데이트
    void lockUserAccount(@Param("userLoginId") Long userLoginId); // 계정 잠금
    void updateLastLogin(@Param("userLoginId") Long userLoginId); // 마지막 로그인 시간 업데이트

}
