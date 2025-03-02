package com.example.demo.service;

import com.example.demo.dto.MarketServiceRequest;
import com.example.demo.dto.MarketServiceResponse;
import com.example.demo.mapper.MarketServiceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MarketService {
    private final MarketServiceMapper marketServiceMapper;

    public void createService(MarketServiceRequest marketServiceRequest) {
        marketServiceMapper.insertService(marketServiceRequest);
    }

    public MarketServiceResponse getServiceById(Long serviceId) {
        return marketServiceMapper.getServiceById(serviceId);
    }

    public List<MarketServiceResponse> getAllServices() {
        return marketServiceMapper.getAllServices();
    }

    public void updateService(MarketServiceResponse marketServiceResponse) {
        marketServiceMapper.updateService(marketServiceResponse);
    }

    public void deleteService(Long serviceId) {
        marketServiceMapper.deleteService(serviceId);
    }
}
