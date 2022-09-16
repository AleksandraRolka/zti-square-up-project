package com.server.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Collection;

import static javax.persistence.GenerationType.AUTO;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer"})
public class Expense {
    @Id
    @GeneratedValue(strategy = AUTO)
    private Long id;
    private String title;
    private String description;
    private Long groupId;
    private Long paidBy;
    private Double amount;
    private Boolean isItPayment;
    @OneToOne(fetch = FetchType.LAZY,
              cascade = {CascadeType.ALL})
    @JoinColumn(name = "payment_details_id", referencedColumnName = "id")
    private Repayment paymentDetails;
    @OneToMany(fetch = FetchType.LAZY,
               cascade = {CascadeType.ALL})
    @Column(name = "split_details")
    private Collection<Share> splitDetails;
    private String createdAt;

    public Expense(String title, String description,
                   Long groupId, Long paidBy,
                   Double amount, Boolean isItPayment,
                   Repayment paymentDetails,
                   Collection<Share> splitDetails) {
        this.title = title;
        this.description = description;
        this.groupId = groupId;
        this.paidBy = paidBy;
        this.amount = amount;
        this.isItPayment = isItPayment;
        this.paymentDetails = paymentDetails;
        this.splitDetails = splitDetails;
        this.createdAt = (new Timestamp(System.currentTimeMillis()).toString());
    }

    public Expense(String title, String description,
                   Long groupId, Long paidBy,
                   Double amount, Boolean isItPayment,
                   Repayment paymentDetails,
                   Collection<Share> splitDetails,
                   String timestamp) {
        this.title = title;
        this.description = description;
        this.groupId = groupId;
        this.paidBy = paidBy;
        this.amount = amount;
        this.isItPayment = isItPayment;
        this.paymentDetails = paymentDetails;
        this.splitDetails = splitDetails;
        this.createdAt = timestamp;
    }
}
