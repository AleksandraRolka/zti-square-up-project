package com.server.repository;

import com.server.models.Share;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;


public interface ShareRepository extends JpaRepository<Share, Long> {

    List<Share> findAll();
    Collection<Share> findByWhoPaidIdAndWhoOwesIdAndGroupIdAndAmountAndCreatedAt(Long whoPaidId, Long whoOwesId, Long groupId, Double amount, String timestamp);
}