package com.server.models;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.io.Serializable;
import java.sql.Timestamp;
import static javax.persistence.GenerationType.AUTO;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer"})
public class Repayment {
    @Id
    @GeneratedValue(strategy = AUTO)
    private Long id;
    private Long fromUserId;
    private Long toUserId;
    private Double amount;
    private Long groupId;
    @NotBlank
    private String createdAt;

    public Repayment(Long fromUserId, Long toUserId, Double amount, Long groupId) {
        this.fromUserId = fromUserId;
        this.toUserId = toUserId;
        this.amount = amount;
        this.groupId = groupId;
        this.createdAt = (new Timestamp(System.currentTimeMillis()).toString());
    }

    public Repayment(Long fromUserId, Long toUserId, Double amount, Long groupId, String timestamp) {
        this.fromUserId = fromUserId;
        this.toUserId = toUserId;
        this.amount = amount;
        this.groupId = groupId;
        this.createdAt = timestamp;
    }
}