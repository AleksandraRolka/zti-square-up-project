package com.server.api.utils;

import lombok.Data;

@Data
public class CustomErrorMessage {

    private String error_message;

    public CustomErrorMessage(String message) {
        this.error_message = message;
    }
}
