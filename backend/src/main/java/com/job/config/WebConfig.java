package com.job.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private JwtInterceptor jwtInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(jwtInterceptor)
        .addPathPatterns("/admin/**", "/employer/**", "/jobseeker/**")
        .excludePathPatterns("/auth/**", "/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**");
    }
}