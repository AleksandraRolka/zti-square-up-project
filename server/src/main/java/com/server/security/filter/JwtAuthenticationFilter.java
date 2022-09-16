package com.server.security.filter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.security.filter.utils.EmailAndPasswordAuthenticationRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@Slf4j
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;

    public JwtAuthenticationFilter(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request,
                                                HttpServletResponse response) throws AuthenticationException {
        String email;
        String password;
        Authentication authenticationToken;
        try {
            if (request.getParameter("email") != null  && request.getParameter("password") != null) {
                email = request.getParameter("email");
                password = request.getParameter("password");

            } else {
                EmailAndPasswordAuthenticationRequest authenticationRequest = new ObjectMapper()
                        .readValue(request.getInputStream(), EmailAndPasswordAuthenticationRequest.class);
                email = authenticationRequest.getEmail();
                password = authenticationRequest.getPassword();
            }
            authenticationToken = new UsernamePasswordAuthenticationToken(
                    email,
                    password,
                    new ArrayList<>());
        } catch (IOException e) {
        throw new RuntimeException(e);
        }

        return authenticationManager.authenticate(authenticationToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain chain, Authentication authResult) throws IOException, ServletException {
        User user = (User)authResult.getPrincipal();
        Algorithm algorithm = Algorithm.HMAC256("secure");

        String refreshToken = JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis() + 100 * 6 * 10000)) // to change for production build
                .withIssuer(request.getRequestURL().toString())
                .withIssuedAt(new Date())
                .withClaim("roles", user.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()))
                .sign(algorithm);

        String accessToken = JWT.create()
                .withSubject(user.getUsername())
                .withIssuer(request.getRequestURL().toString())
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + 300 * 6 * 10000)) // to change for production build
                .withClaim("roles", user.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()))
                .sign(algorithm);

//        response.setHeader("access_token", accessToken);
//        response.setHeader("refresh_token", refreshToken);
        Map<String, String> tokens = new HashMap<>();
        tokens.put("access_token", accessToken);
        tokens.put("refresh_token", refreshToken);
        response.setContentType(APPLICATION_JSON_VALUE);
        new ObjectMapper().writeValue(response.getOutputStream(), tokens);
    }
}
