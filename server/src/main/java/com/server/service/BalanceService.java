package com.server.service;

import com.server.models.Balance;

public interface BalanceService {

    public void addEmptyBalanceForUser(Long userId);
    public void updateUserBalance(Long userId, Double oweAmount, Double owedAmount);

    public void setUserBalance(Long userId, Double oweAmount, Double owedAmount);
    public Balance findByUserId(Long id);

    public Balance getByUserId(Long userId);
    public Balance getByUserAndGroupId(Long groupId, Long userId);
}


