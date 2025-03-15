package com.example.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;

import com.example.demo.security.JwtTokenProvider;
import com.example.demo.security.oauth2.CustomOAuth2UserService;
import com.example.demo.security.oauth2.HttpCookieOAuth2AuthorizationRequestRepository;
import com.example.demo.security.oauth2.OAuth2AuthenticationFailureHandler;
import com.example.demo.security.oauth2.OAuth2AuthenticationSuccessHandler;

import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityBeanConfig {

    @Value("${oauth2.authorizedRedirectUris}")
    private String[] authorizedRedirectUris;

    @Bean
    public AuthorizationRequestRepository<OAuth2AuthorizationRequest> authorizationRequestRepository() {
        return new HttpCookieOAuth2AuthorizationRequestRepository();
    }

    @Bean
    public OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler(
            JwtTokenProvider jwtTokenProvider, 
            AuthorizationRequestRepository<OAuth2AuthorizationRequest> authorizationRequestRepository) {
        List<String> authorizedUris = Arrays.asList(authorizedRedirectUris);
        return new OAuth2AuthenticationSuccessHandler(jwtTokenProvider, authorizedUris, authorizationRequestRepository);
    }

    @Bean
    public OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler(
            AuthorizationRequestRepository<OAuth2AuthorizationRequest> authorizationRequestRepository) {
        return new OAuth2AuthenticationFailureHandler(authorizationRequestRepository);
    }
}
