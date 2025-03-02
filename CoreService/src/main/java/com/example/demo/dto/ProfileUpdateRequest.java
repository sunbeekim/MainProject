package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ProfileUpdateRequest {
    private String name;
    private String nickname;
    private String phoneNumber;
    private String bio;
    private List<Integer> hobbyIds;
    private String locationName;
    private Double latitude;
    private Double longitude;
}
