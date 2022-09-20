package com.server.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;

import java.sql.Timestamp;

import static javax.persistence.GenerationType.AUTO;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"first_user_id", "second_user_id", "group_id"})})
public class Debt {
    @Id
    @GeneratedValue(strategy = AUTO)
    private Long id;
    @Column(name="first_user_id")
    private Long firstUserId;
    @Column(name="second_user_id")
    private Long secondUserId;
    @Column(name="group_id")
    private Long groupId;
    private Double balance;
    private java.sql.Timestamp updated_at;
    private java.sql.Timestamp last_settle_at;

    public Debt(Long firstUserId, Long secondUserId, Long groupId) {
        this.firstUserId = firstUserId;
        this.secondUserId = secondUserId;
        this.groupId = groupId;
        this.balance = 0.00;
        this.updated_at = new Timestamp(System.currentTimeMillis());
        this.last_settle_at = new Timestamp(System.currentTimeMillis());
    }

    public Debt(Long firstUserId, Long secondUserId, Long groupId, Double balance) {
        this.firstUserId = firstUserId;
        this.secondUserId = secondUserId;
        this.groupId = groupId;
        this.balance = balance;
        this.updated_at = new Timestamp(System.currentTimeMillis());
        this.last_settle_at = new Timestamp(System.currentTimeMillis());
    }
}
