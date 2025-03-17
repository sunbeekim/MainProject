package com.example.demo.service.Market;

import com.example.demo.mapper.Market.UserLocationMapper;
import com.example.demo.model.Market.UserLocation;
import org.springframework.stereotype.Service;

/**
 * 사용자 위치 관련 로직을 처리하는 서비스 클래스
 */
@Service
public class UserLocationService {
    private final UserLocationMapper userLocationMapper;

    public UserLocationService(UserLocationMapper userLocationMapper) {
        this.userLocationMapper = userLocationMapper;
    }

    /**
     * 사용자의 위치 정보를 저장하거나 업데이트
     */
    public void updateUserLocation(UserLocation location) {
        userLocationMapper.insertOrUpdateUserLocation(location);
    }

    /**
     * 사용자의 위치 정보를 조회
     */
    public UserLocation getUserLocation(String email) {
        return userLocationMapper.getUserLocation(email);
    }
}
