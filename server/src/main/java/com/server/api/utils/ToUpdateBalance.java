package com.server.api.utils;


import lombok.Data;

@Data
public class ToUpdateBalance {
    private long user_id;
    private Double amount;
    private Boolean isReducing;
}