package com.example.demo.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/assist/upload")
public class UploadProfileController {
    @PostMapping("/profile")
    public String uploadProfile(@RequestPart("file") MultipartFile file) {
        System.out.println("Profile uploaded successfully");
        return "Profile uploaded successfully";
    }
}