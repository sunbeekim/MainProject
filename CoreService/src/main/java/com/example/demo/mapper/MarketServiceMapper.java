package com.example.demo.mapper;

import com.example.demo.dto.MarketServiceRequest;
import com.example.demo.dto.MarketServiceResponse;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
@Mapper
public interface MarketServiceMapper {
    void insertService(MarketServiceRequest marketServiceRequest);

    MarketServiceResponse getServiceById(@Param("serviceId") Long serviceId);

    List<MarketServiceResponse> getAllServices();

    void updateService(MarketServiceResponse marketServiceResponse);

    void deleteService(@Param("serviceId") Long serviceId);
}
