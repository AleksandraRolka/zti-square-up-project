package com.server.service;

import com.server.models.Balance;
import com.server.models.Debt;

import java.util.Optional;

public interface DebtService {

    public Balance getByUserId(Long userId);
    public Optional<Debt> getByUserAndGroupId(Long groupId, Long userId);
}
