package com.example.demo.mapper;

import com.example.demo.model.User;
import com.example.demo.model.UserAccountInfo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {

    // 사용자 등록
    int insertUser(User user);

    // 사용자 계정 정보 추가
    int insertUserAccountInfo(UserAccountInfo userAccountInfo);

    // 이메일로 사용자 찾기
    User findByEmail(String email);

    // 전화번호로 사용자 찾기
    User findByPhoneNumber(String phoneNumber);

    // 닉네임으로 사용자 찾기
    User findByNickname(String nickname);

    // 로그인 실패 횟수 업데이트
    int updateFailedLoginAttempts(@Param("email") String email, @Param("attempts") Integer attempts);

    // 로그인 잠금 상태 업데이트
    int updateLoginLockStatus(@Param("email") String email, @Param("isLocked") Boolean isLocked);

    // 로그인 시간 업데이트
    int updateLoginTime(@Param("email") String email);

    // 비밀번호 해시 업데이트
    int updateUserPasswordHash(@Param("email") String email, @Param("newPasswordHash") String newPasswordHash);

    // 계정 상태 업데이트
    int updateAccountStatus(@Param("email") String email, @Param("accountStatus") String accountStatus);
}
