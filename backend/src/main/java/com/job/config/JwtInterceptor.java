package com.job.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import com.job.util.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
                
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
                response.setStatus(HttpServletResponse.SC_OK);
                return true;
            }

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }

        String token = header.substring(7);

        try {
            Claims claims = jwtUtil.validateToken(token);
            
            String role = claims.get("role", String.class);

            if (request.getRequestURI().startsWith("/admin") && !"ADMIN".equals(role)) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                return false;
            }
            // && !"ADMIN".equals(role)
            if (request.getRequestURI().startsWith("/employer") && !"EMPLOYER".equals(role)) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                return false;
            }
//  && !"ADMIN".equals(role)
            if (request.getRequestURI().startsWith("/jobseeker") && !"JOB_SEEKER".equals(role)) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                return false;
            }

            request.setAttribute("userId", claims.get("userId"));
            request.setAttribute("role", claims.get("role"));

            return true;

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }
    }
}