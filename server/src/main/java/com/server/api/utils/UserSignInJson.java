package com.server.api.utils;

import lombok.Data;

@Data
public
class UserSignInJson {
    private String email;
    private String password;
}
