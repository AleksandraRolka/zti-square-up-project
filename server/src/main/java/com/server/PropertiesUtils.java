package com.server;

import com.server.security.filter.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;

public class PropertiesUtils {

    @Autowired
    private JwtUtils props;

    public String getSecretKey() {
        System.out.println("SecretKey is : " + props.getSecretKey());
        return props.getSecretKey();
    }
}
