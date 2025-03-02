package com.example.demo.dto;


import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter

public class MarketServiceResponse {
    private Long serviceId;
    private String email;
    private String serviceTitle;
    private String serviceDescription;
    private LocalDateTime serviceCreatedAt;
    private LocalDateTime serviceUpdatedAt;
    private Integer categoryId;
}
