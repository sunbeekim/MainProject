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
}