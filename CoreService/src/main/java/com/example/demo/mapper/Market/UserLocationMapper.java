package com.example.demo.mapper.Market;

import com.example.demo.model.Market.UserLocation;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 사용자 위치 정보를 데이터베이스에서 조회하거나 저장하는 Mapper
 */
@Mapper
public interface UserLocationMapper {
    /**
     * 사용자의 위치를 저장하거나 업데이트
     */
    void insertOrUpdateUserLocation(UserLocation userLocation);

    /**
     * 사용자의 위치 정보를 가져옴
     */
    UserLocation getUserLocation(@Param("email") String email);
}
