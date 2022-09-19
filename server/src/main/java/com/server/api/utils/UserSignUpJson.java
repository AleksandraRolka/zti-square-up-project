package com.server.api.utils;

import lombok.Data;

@Data
public
class UserSignUpJson {
    private String first_name;
    private String last_name;
    private String email;
    private String password;
}
