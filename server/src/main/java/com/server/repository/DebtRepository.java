package com.server.repository;

import com.server.models.Balance;
import com.server.models.Debt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.Collection;

public interface DebtRepository extends JpaRepository<Debt, Long> {

//    @Query(value = "FROM debt d WHERE d.first_user_id = ?1 AND d.second_user_id = ?2 AND d.group_id = ?3",
//            nativeQuery = true)
    Debt findByGroupIdAndFirstUserIdAndSecondUserId(Long first_user_id, Long second_user_id, Long group_id);

    @Query(value = "FROM debt d WHERE d.first_user_id = ?1 OR d.second_user_id = ?1",
            nativeQuery = true)
    Balance getByUserId(Long userId);

    @Query(value = "FROM debt d WHERE (d.first_user_id = ?2 OR d.second_user_id = ?2) AND d.group_id = ?1",
            nativeQuery = true)
    Balance getByGroupIdAndUserId(Long groupId, Long userId);

    @Query(value = "FROM debt d WHERE ((d.first_user_id = ?2 AND d.second_user_id = ?3) OR (d.first_user_id = ?3 AND d.second_user_id = ?2)) AND d.group_id = ?1",
            nativeQuery = true)
    Debt getByGroupIdAndFirstUserIdAndSecondUserIdWithOr(Long groupId, Long firstUserId, Long secondUserId);

//    @Query(value = "FROM debt d WHERE d.first_user_id = ?2 AND d.second_user_id = ?3 AND d.group_id = ?1",
//            nativeQuery = true)
//    Debt findByGroupIdAndFirstUserIdAndSecondUserId(Long groupId, Long firstUserId, Long secondUserId);


    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "UPDATE Debt SET first_user_id=?2, second_user_id=?3, balance=?4  WHERE group_id = ?1 AND first_user_id=?2 AND second_user_id=?3",
            nativeQuery = true)
    void updateByGroupIdAndFirstUserIdAndSecondUserId(Long groupId, Long firstUserId, Long secondUserId, Double amount);

    Collection<Debt> findByGroupIdAndFirstUserId(Long group_id, Long user_id);

}