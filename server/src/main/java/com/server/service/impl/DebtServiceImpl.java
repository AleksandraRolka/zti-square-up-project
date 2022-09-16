package com.server.service.impl;

import com.server.models.Balance;
import com.server.models.Debt;
import com.server.repository.DebtRepository;
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

    public Balance getByUserId(Long userId) {
        return debtRepository.getByUserId(userId);
    }

    public Optional<Debt> getByUserAndGroupId(Long groupId, Long userId) {
        Optional<Debt> expectedDebt = debtRepository.findById(groupId);
                getByUserAndGroupId(groupId, userId);
        return expectedDebt;
    }
}
