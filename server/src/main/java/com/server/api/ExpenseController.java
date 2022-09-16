package com.server.api;

import com.server.api.utils.ExpenseFromJson;
import com.server.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api/expense")
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping(path = "/add")
    public ResponseEntity<?> createExpense(@RequestBody ExpenseFromJson expense) {
        expenseService.addExpense(expense);
        return ResponseEntity.ok().build();
    }

    @GetMapping(path = "/get/all")
    public ResponseEntity<?> getAllExpense() {
        return ResponseEntity.ok().body(expenseService.getAll());
    }
}
