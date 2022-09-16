package com.server.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import java.sql.Timestamp;

import static javax.persistence.GenerationType.AUTO;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer"})
public class Share {
    @Id
    @GeneratedValue(strategy = AUTO)
    private Long id;
    private Long whoPaidId;
    private Long whoOwesId;
    private Long groupId;
    private Double amount = 0.0;
    private String createdAt;

    public Share(Long whoPaidId, Long whoOwesId, Long groupId, Double amount) {
        this.whoPaidId = whoPaidId;
        this.whoOwesId = whoOwesId;
        this.groupId = groupId;
        this.amount = amount;
        this.createdAt = (new Timestamp(System.currentTimeMillis()).toString());
    }

    public Share(Long whoPaidId, Long whoOwesId, Long groupId, Double amount, String timestamp) {
        this.whoPaidId = whoPaidId;
        this.whoOwesId = whoOwesId;
        this.groupId = groupId;
        this.amount = amount;
        this.createdAt = timestamp;
    }
}