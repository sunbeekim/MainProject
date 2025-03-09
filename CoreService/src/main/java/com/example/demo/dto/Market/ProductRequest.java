package com.example.demo.dto.Market;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {
    @NotBlank private String title;
    @NotBlank private String description;
    @NotNull private Integer price;
    @NotBlank private String email;
    @NotNull private Long categoryId;
    @NotNull private Long hobbyId;
    @NotBlank private String transactionType;
    @NotBlank private String registrationType;
    private String meetingPlace;
    private Double latitude;
    private Double longitude;
    private String address;
    @NotNull private Integer maxParticipants;
    private String startDate;
    private String endDate;

    // 이미지 URL 리스트
    private List<String> imagePaths;
}
