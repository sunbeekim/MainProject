package com.example.demo.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class LoggingFilter implements GlobalFilter, Ordered {
    
    private static final Logger log = LoggerFactory.getLogger(LoggingFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        
        log.info("=== Gateway 요청 로그 ===");
        log.info("Path: {}", request.getPath());
        log.info("Method: {}", request.getMethod());
        log.info("Headers: {}", request.getHeaders());
        
        return chain.filter(exchange)
            .then(Mono.fromRunnable(() -> {
                log.info("=== Gateway 응답 로그 ===");
                log.info("Status: {}", exchange.getResponse().getStatusCode());
                log.info("Headers: {}", exchange.getResponse().getHeaders());
            }));
    }

    @Override
    public int getOrder() {
        return -1; // 최우선 실행
    }
} 