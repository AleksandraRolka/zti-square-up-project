package com.server.service.impl;

import com.server.models.Balance;
import com.server.models.Debt;
import com.server.repository.DebtRepository;
import com.server.service.BalanceService;
import com.server.service.DebtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class DebtServiceImpl implements DebtService {

    private final DebtRepository debtRepository;
    private final BalanceService balanceService;

    public Balance getByUserId(Long userId) {
        return debtRepository.getByUserId(userId);
    }

    public Debt getByGroupIdAndUsersIds(Long groupId, Long firstUserId, Long secondUserId) {
        Debt usersDebtBetween = debtRepository.findByGroupIdAndFirstUserIdAndSecondUserId(groupId, firstUserId, secondUserId);
        if(usersDebtBetween == null)
            usersDebtBetween = debtRepository.findByGroupIdAndFirstUserIdAndSecondUserId(groupId, secondUserId, firstUserId);
        return usersDebtBetween;
    }

    public Debt updateByGroupIdAndUsersIds(Long groupId, Long firstUserId, Long secondUserId, Double amount) {
        Debt currentUsersDebtBetween = debtRepository.findByGroupIdAndFirstUserIdAndSecondUserId(groupId, firstUserId, secondUserId);
        if(currentUsersDebtBetween == null)
            currentUsersDebtBetween = debtRepository.findByGroupIdAndFirstUserIdAndSecondUserId(groupId, secondUserId, firstUserId);
        Double updatedBalance = 0.0;
        if (firstUserId == currentUsersDebtBetween.getFirstUserId()) {
            updatedBalance = currentUsersDebtBetween.getBalance() + amount;
        } else {
            updatedBalance = currentUsersDebtBetween.getBalance() - amount;
        }
        debtRepository.updateByGroupIdAndFirstUserIdAndSecondUserId(groupId, firstUserId, secondUserId, updatedBalance);
        Debt updatedUsersDebtBetween = debtRepository.findByGroupIdAndFirstUserIdAndSecondUserId(groupId, firstUserId, secondUserId);
        if(currentUsersDebtBetween == null)
            currentUsersDebtBetween = debtRepository.findByGroupIdAndFirstUserIdAndSecondUserId(groupId, secondUserId, firstUserId);

        currentUsersDebtBetween = debtRepository.findByGroupIdAndFirstUserIdAndSecondUserId(groupId, firstUserId, secondUserId);
        if (currentUsersDebtBetween.getBalance() == 0.0) {
            balanceService.updateUserBalance( firstUserId, amount, 0.0);
            balanceService.updateUserBalance( secondUserId, 0.0, amount);
        }
        return updatedUsersDebtBetween;
    }
}
