package com.server.repository;

import com.server.models.Balance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;

public interface BalanceRepository extends JpaRepository<Balance, Long> {

    Balance findByUserId(Long user_id);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "UPDATE Balance SET owe_amount=?2, owed_amount=?3, total_balance=?4  WHERE user_id = ?1",
            nativeQuery = true)
    void updateUserBalance(Long userId, Double oweAmount, Double owedAmount, Double totalBalance);
}
