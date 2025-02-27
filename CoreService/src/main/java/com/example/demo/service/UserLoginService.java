package com.example.demo.service;
// 로그인 로직 처리 (DTO, Mapper)


import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.mapper.UserLoginMapper;
import com.example.demo.model.UserLogin;
import com.example.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

@Service
public class UserLoginService {

    @Autowired
    private UserLoginMapper userLoginMapper;

    @Autowired
    private JwtUtil jwtUtil;

        public UserLogin findByUsername(String username) { //DB에서 userLogin 가져오기
        return userLoginMapper.findByUsername(username);
    }

    public UserLogin findByUserLoginId(Long userLoginId) { //DB에서 userLogin 가져오기
        return userLoginMapper.findByUserLoginId(userLoginId);
    }

    public LoginResponse login(LoginRequest loginRequest) {
        UserLogin userLogin = userLoginMapper.findByUsername(loginRequest.getUsername());
        LoginResponse response = new LoginResponse();

        if (userLogin == null) {
            response.setMessage("아이디가 존재하지 않습니다.");
            return response;
        }

        // 로그인 잠금 여부 확인
        if (userLogin.getLoginIsLocked()) {
            response.setMessage("계정이 잠겼습니다.");
            return response;
        }

        // 비밀번호 체크 (BCrypt 사용)
        if (!BCrypt.checkpw(loginRequest.getPassword(), userLogin.getPasswordHash())) {
            int failedAttempts = userLogin.getLoginFailedAttempts() + 1;
            userLoginMapper.updateLoginFailedAttempts(userLogin.getUserLoginId(), failedAttempts);

            if (failedAttempts >= 5) {
                userLoginMapper.lockUserAccount(userLogin.getUserLoginId());
                response.setMessage("로그인 5회 시도를 초과하여 계정이 잠겼습니다.");
            } else {
                response.setMessage("비밀번호가 틀렸습니다.");
            }
            return response;
        }
        // 로그인 성공 시 처리
        userLoginMapper.updateLastLogin(userLogin.getUserLoginId());
        String token = jwtUtil.generateToken(userLogin); // JWT 토큰 생성
        response.setAccessToken(token);
        response.setMessage("로그인이 되었습니다.");
        return response;
    }

    public void invalidateRefreshToken(Long userLoginId) {
        // Redis 또는 DB에서 해당 userLoginId의 refreshToken을 삭제
        userLoginMapper.deleteRefreshToken(userLoginId);
    }


}