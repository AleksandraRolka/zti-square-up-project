package com.server.repository;

import com.server.models.Balance;
import com.server.models.Debt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;

public interface DebtRepository extends JpaRepository<Debt, Long> {

    @Query(value = "FROM debt d WHERE d.first_user_id = ?1 AND second_user_id = ?2 AND group_id = ?3",
            nativeQuery = true)
    Collection<Long> findByAllAtributes(Long first_user_id, Long second_user_id, Long group_id);

    @Query(value = "FROM debt d WHERE d.first_user_id = ?1 OR second_user_id = ?1",
            nativeQuery = true)
    Balance getByUserId(Long userId);

    @Query(value = "FROM debt d WHERE d.first_user_id = ?2 OR second_user_id = ?2 AND group_id = ?1",
            nativeQuery = true)
    Collection<Balance> getByUserAndGroupId(Long groupId, Long userId);
}