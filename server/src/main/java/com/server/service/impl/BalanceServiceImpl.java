package com.server.service.impl;

import com.server.models.Balance;
import com.server.repository.BalanceRepository;
import com.server.service.BalanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class BalanceServiceImpl implements BalanceService {

    private final BalanceRepository balanceRepository;

    public void addEmptyBalanceForUser(Long userId) {
        Balance balance = new Balance(userId);
        balanceRepository.save(balance);
    }

    public void updateUserBalance(Long userId, Double oweAmount, Double owedAmount, Double totalBalance) {
        balanceRepository.updateUserBalance(userId, oweAmount, owedAmount, totalBalance);
    }

    public Balance findByUserId(Long id) {
        return balanceRepository.findByUserId(id);
    }

    @Override
    public Balance getByUserId(Long userId) {
        return balanceRepository.findByUserId(userId);
    }

    public Balance getByUserAndGroupId(Long groupId, Long userId) {
        return null;
    }
}
