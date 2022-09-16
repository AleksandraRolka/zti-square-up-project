package com.server.api.utils;

import lombok.Data;
import java.util.Collection;

@Data
public class ExpenseFromJson {
    private String title;
    private String description;
    private Long group_id;
    private Long paid_by;
    private Double amount;
    private Boolean is_it_payment;
    private PaymentFromJson payment_details;
    private Collection<ShareFromJson> split_details;
}
