package com.server.service;

import com.server.api.utils.ExpenseFromJson;
import com.server.models.Expense;

import java.util.Collection;

public interface ExpenseService {

    Collection<Expense> getAll();

    void addExpense(ExpenseFromJson expense);
}
