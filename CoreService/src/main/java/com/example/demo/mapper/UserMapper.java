package com.example.demo.mapper;

import com.example.demo.model.User;
import com.example.demo.model.UserLogin;
import com.example.demo.model.UserAccountInfo;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
    int insertUser(User user);
    int insertUserLogin(UserLogin userLogin);
    int insertUserAccountInfo(UserAccountInfo userAccountInfo);
    User findByEmail(String email);
    User findByPhoneNumber(String phoneNumber);
    User findByNickname(String nickname);
    
    // 로그인에 필요한 메소드 추가
    UserLogin findUserLoginByUserId(Integer userId);
    UserAccountInfo findUserAccountInfoByUserId(Integer userId);
    int updateLoginTime(Integer userId);
    int updateFailedLoginAttempts(Integer userId, Integer attempts);
    int updateLoginLockStatus(Integer userId, Boolean isLocked);
}