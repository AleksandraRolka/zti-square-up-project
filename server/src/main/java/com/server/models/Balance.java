package com.server.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import java.sql.Timestamp;

import static javax.persistence.GenerationType.AUTO;

@Slf4j
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = "user_id")})
public class Balance {
    @Id
    @GeneratedValue(strategy = AUTO)
    private Long id;
    @NotNull
    @Column(name="user_id")
    private Long userId;
    private Double oweAmount;
    private Double owedAmount;
    private Double totalBalance;
    private String updatedAt;

    public Balance(Long user_id) {
        this.userId = user_id;
        this.oweAmount = 0.0;
        this.owedAmount = 0.0;
        this.totalBalance = 0.0;
        this.updatedAt = (new Timestamp(System.currentTimeMillis()).toString());
    }
}
