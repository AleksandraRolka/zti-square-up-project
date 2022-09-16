package com.server.api.utils;

import lombok.Data;

@Data
public class PaymentFromJson {
    private Long from_user_id;
    private Long to_user_id;
    private Double amount;
    private Long group_id;
}
