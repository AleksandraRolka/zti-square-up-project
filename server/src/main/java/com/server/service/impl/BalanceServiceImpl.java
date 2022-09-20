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

    public void updateUserBalance(Long userId, Double oweAmount, Double owedAmount) {
        log.info("Updating balance..");
        Balance currentBalance = findByUserId(userId);
        log.info("To add oweAmount: {}", oweAmount);
        log.info("Current oweAmount: {}", currentBalance.getOweAmount() );
        log.info("To add owedAmount: {}", owedAmount);
        log.info("Current owedAmount: {}", currentBalance.getOwedAmount() );
        balanceRepository.updateUserBalance(userId,
                currentBalance.getOweAmount() + oweAmount,
                currentBalance.getOwedAmount()  + owedAmount,
                (currentBalance.getOwedAmount()  + owedAmount)-(currentBalance.getOweAmount() + oweAmount));
    }

    public void setUserBalance(Long userId, Double oweAmount, Double owedAmount) {
        log.info("Setting updated balance..");
        balanceRepository.updateUserBalance(userId,
                oweAmount,
                owedAmount,
                (owedAmount - oweAmount));
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
