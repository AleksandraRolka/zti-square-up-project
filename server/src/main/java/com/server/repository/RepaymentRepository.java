package com.server.repository;

import com.server.models.Repayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.sql.Timestamp;
import java.util.Collection;

public interface RepaymentRepository extends JpaRepository<Repayment, Long> {


    Collection<Repayment> findByFromUserIdAndToUserIdAndAmountAndGroupIdAndCreatedAt(Long fromUserId, Long toUserId, Double amount, Long groupId, String timestamp);

}
