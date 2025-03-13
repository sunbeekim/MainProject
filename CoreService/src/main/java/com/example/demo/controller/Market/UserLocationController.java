package com.example.demo.controller.Market;

import com.example.demo.dto.Market.LocationRequest;
import com.example.demo.model.Market.UserLocation;
import com.example.demo.service.Market.UserLocationService;
import com.example.demo.security.JwtTokenProvider;
import com.example.demo.util.BaseResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/core/market/users")
public class UserLocationController {
    private final UserLocationService userLocationService;
    private final JwtTokenProvider jwtTokenProvider;

    public UserLocationController(UserLocationService userLocationService, JwtTokenProvider jwtTokenProvider) {
        this.userLocationService = userLocationService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/location")
    public ResponseEntity<BaseResponse<String>> updateUserLocation(
            @RequestBody LocationRequest request,
            @RequestHeader(value = "Authorization", required = false) String token) {

        // ✅ 토큰이 없으면 에러 응답 반환
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity
                    .status(401)
                    .body(new BaseResponse<>("error", "토큰이 누락되었습니다. 인증이 필요합니다.", null));
        }

        // ✅ 토큰 검증
        String email;
        try {
            email = jwtTokenProvider.getUsername(token);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(BaseResponse.errorResponse("유효하지 않은 토큰입니다."));
        }

        // ✅ 위치 정보 저장
        UserLocation location = new UserLocation();
        location.setEmail(email);
        location.setLatitude(request.getLatitude());
        location.setLongitude(request.getLongitude());
        location.setLocationName(request.getLocationName());

        userLocationService.updateUserLocation(location);

        return ResponseEntity.ok(new BaseResponse<>("위치 업데이트 완료"));
    }
}