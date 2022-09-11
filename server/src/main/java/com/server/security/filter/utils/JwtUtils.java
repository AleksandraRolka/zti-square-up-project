package com.server.security.filter.utils;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;
import org.springframework.context.annotation.Configuration;


@Slf4j
@ConfigurationProperties(prefix="app.config")
@ConstructorBinding
@Configuration
@Data
public class JwtUtils {

    private String secretkey;

    public String getSecretKey() {
        log.info("secretKey: {}", secretkey);
        return secretkey;
    }

    public void setSecretKey(String secretkey) {
        this.secretkey = secretkey;
    }
}
