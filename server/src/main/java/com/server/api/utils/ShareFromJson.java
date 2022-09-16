package com.server.api.utils;

import lombok.Data;

@Data
public class ShareFromJson {
    private Long who_paid_id;
    private Long who_owes_id;
    private Long group_id;
    private Double amount;
}
