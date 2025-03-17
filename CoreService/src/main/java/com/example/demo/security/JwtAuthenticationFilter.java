package com.example.demo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final JwtTokenBlacklistService blacklistService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String token = resolveToken(request);
        String path = request.getRequestURI();

        // 로깅 추가
        log.debug("Received request to path: {}", path);

        if (token != null) {
            try {
                boolean isValid = jwtTokenProvider.validateToken(token);
                boolean isBlacklisted = blacklistService.isBlacklisted(token);

                log.debug("Token validation: isValid={}, isBlacklisted={}", isValid, isBlacklisted);

                if (isValid && !isBlacklisted) {
                    Authentication auth = jwtTokenProvider.getAuthentication(token);
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    log.debug("Authentication successful for user: {}", auth.getName());
                } else if (isBlacklisted) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Token has been invalidated");
                    log.warn("Attempt to use blacklisted token for path: {}", path);
                    return;
                } else {
                    log.warn("Invalid token presented for path: {}", path);
                }
            } catch (Exception e) {
                log.error("JWT Authentication Error: {}", e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Unauthorized access: Invalid token");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
        
    private String getJwtFromRequest(HttpServletRequest request) {
        return resolveToken(request);
    }
}
