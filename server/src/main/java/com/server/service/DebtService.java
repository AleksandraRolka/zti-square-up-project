package com.server.service;

import com.server.models.Balance;
import com.server.models.Debt;

import java.util.Collection;
import java.util.Optional;

public interface DebtService {

    public Balance getByUserId(Long userId);
    public Debt getByGroupIdAndUsersIds(Long groupId, Long firstUserId, Long secondUserId);
    public Debt updateByGroupIdAndUsersIds(Long groupId, Long firstUserId, Long secondUserId, Double amount);

    Collection<Debt> getByGroupIdAndUserId(Long group_id, Long user_id);
}
