package com.server.repository;

import com.server.models.Expense;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ExpenseRepository extends JpaRepository<Expense, Long> {


}