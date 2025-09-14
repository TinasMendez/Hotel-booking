package com.miapp.reservashotel.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * Custom entry point to avoid the browser Basic-Auth popup.
 * It returns a JSON 401 without "WWW-Authenticate: Basic".
 */
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request,
                            HttpServletResponse response,
                            org.springframework.security.core.AuthenticationException authException)
            throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        String body = "{\"status\":401,\"error\":\"Unauthorized\",\"message\":\"Authentication required or token invalid\"}";
        response.getWriter().write(body);
    }
}
