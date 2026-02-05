package com.ll.homescope.global.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AdminKeyInterceptor implements HandlerInterceptor {

    @Value("${custom.admin.key}")
    private String adminKey;

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler
    ) throws Exception {

        String uri = request.getRequestURI();

        if (!uri.contains("/admin")) {
            return true;
        }

        String key = request.getHeader("x-admin-key");

        if (!adminKey.equals(key)) {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            return false;
        }

        return true;
    }

}
