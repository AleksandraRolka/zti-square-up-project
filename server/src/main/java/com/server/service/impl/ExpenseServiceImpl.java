package com.server.service.impl;

import com.server.api.utils.ExpenseFromJson;
import com.server.models.Expense;
import com.server.models.Repayment;
import com.server.models.Share;
import com.server.repository.ExpenseRepository;
import com.server.repository.RepaymentRepository;
import com.server.repository.ShareRepository;
import com.server.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;


@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final RepaymentRepository repaymentRepository;
    private final ShareRepository shareRepository;

    public Collection<Expense> getAll() {
        return expenseRepository.findAll();
    }

    public void addExpense(ExpenseFromJson expenseObj) {
        log.info("addExpense called: {}", expenseObj);
        Repayment paymentDetails = null;
        Collection<Share> splitDetails = new ArrayList<>();
        String timestamp = (new Timestamp(System.currentTimeMillis())).toString();

        if(expenseObj.getIs_it_payment()) {
            Repayment toAdd = new Repayment(
                    expenseObj.getPayment_details().getFrom_user_id(),
                    expenseObj.getPayment_details().getTo_user_id(),
                    expenseObj.getPayment_details().getAmount(),
                    expenseObj.getPayment_details().getGroup_id(),
                    timestamp);
            log.info("Repayment toAdd: {}", toAdd);
            repaymentRepository.save(toAdd);
            Collection<Repayment> added =
                    repaymentRepository.findByFromUserIdAndToUserIdAndAmountAndGroupIdAndCreatedAt(
                        expenseObj.getPayment_details().getFrom_user_id(),
                        expenseObj.getPayment_details().getTo_user_id(),
                        expenseObj.getPayment_details().getAmount(),
                        expenseObj.getPayment_details().getGroup_id(),
                        timestamp);
            if(!added.isEmpty()) {
                paymentDetails = added.stream().findFirst().get();
            }
        } else {
            if(expenseObj.getSplit_details() != null) {
                expenseObj.getSplit_details().forEach(s -> {
                    Share toAdd = new Share(s.getWho_paid_id(), s.getWho_owes_id(), s.getGroup_id(), s.getAmount(), timestamp);
                    shareRepository.save(toAdd);

                    Collection<Share> added = shareRepository.findByWhoPaidIdAndWhoOwesIdAndGroupIdAndAmountAndCreatedAt(
                            s.getWho_paid_id(),
                            s.getWho_owes_id(),
                            s.getGroup_id(),
                            s.getAmount(),
                            timestamp);
                    if(!added.isEmpty()) {
                        splitDetails.add(added.stream().findFirst().get());
                    }
                });
            }
        }
        log.info("Payment to add: {}", paymentDetails);
        log.info("Split to add: {}", splitDetails);

        Expense newExpense = new Expense(
                expenseObj.getTitle(),
                expenseObj.getDescription(),
                expenseObj.getGroup_id(),
                expenseObj.getPaid_by(),
                expenseObj.getAmount(),
                expenseObj.getIs_it_payment(),
                paymentDetails,
                splitDetails,
                timestamp);

        log.info("Expense to save: {}", newExpense);
        expenseRepository.save(newExpense);
    }
}