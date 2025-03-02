package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class MarketServiceRequest {
    private Long serviceId;
    private String email;
    private String serviceTitle;
    private String serviceDescription;
    private Long categoryId;
}