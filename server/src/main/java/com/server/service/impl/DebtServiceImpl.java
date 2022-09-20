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
import java.util.Collection;
import java.util.Optional;

import static java.lang.Math.abs;

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
//        if(usersDebtBetween == null)
//            usersDebtBetween = debtRepository.findByGroupIdAndFirstUserIdAndSecondUserId(groupId, secondUserId, firstUserId);
        return usersDebtBetween;
    }

    public Debt updateByGroupIdAndUsersIds(Long groupId, Long firstUserId, Long secondUserId, Double amount) {
        log.info("Updating users debt between..");
        Debt currentUsersDebtBetween = debtRepository.findByGroupIdAndFirstUserIdAndSecondUserId(groupId, firstUserId, secondUserId);
//        if(currentUsersDebtBetween == null)
//            currentUsersDebtBetween = debtRepository.findByGroupIdAndFirstUserIdAndSecondUserId(groupId, secondUserId, firstUserId);
        Double updatedBalance = 0.0;
        updatedBalance = currentUsersDebtBetween.getBalance() + amount;
        debtRepository.updateByGroupIdAndFirstUserIdAndSecondUserId(groupId, firstUserId, secondUserId, currentUsersDebtBetween.getBalance() + amount);
        debtRepository.updateByGroupIdAndFirstUserIdAndSecondUserId(groupId, secondUserId , firstUserId, -currentUsersDebtBetween.getBalance() - amount);
        Debt updatedUsersDebtBetween = debtRepository.findByGroupIdAndFirstUserIdAndSecondUserId(groupId, firstUserId, secondUserId);
//        if(currentUsersDebtBetween == null)
//            currentUsersDebtBetween = debtRepository.findByGroupIdAndFirstUserIdAndSecondUserId(groupId, secondUserId, firstUserId);

//        Debt currentUsersDebtBetween1 = debtRepository.findByGroupIdAndFirstUserIdAndSecondUserId(groupId, firstUserId, secondUserId);
//        Debt currentUsersDebtBetween2 = debtRepository.findByGroupIdAndFirstUserIdAndSecondUserId(groupId, secondUserId, firstUserId);
        if (updatedUsersDebtBetween.getBalance() == 0.0) {
            balanceService.setUserBalance( firstUserId,   (abs(currentUsersDebtBetween.getBalance()) - amount),(abs(currentUsersDebtBetween.getBalance() + amount)));
            balanceService.setUserBalance( secondUserId,  (abs(currentUsersDebtBetween.getBalance()) - amount),(abs(currentUsersDebtBetween.getBalance() + amount)));
        }
        return updatedUsersDebtBetween;
    }

    @Override
    public Collection<Debt> getByGroupIdAndUserId(Long group_id, Long user_id) {
        return debtRepository.findByGroupIdAndFirstUserId(group_id, user_id);
    }


}
