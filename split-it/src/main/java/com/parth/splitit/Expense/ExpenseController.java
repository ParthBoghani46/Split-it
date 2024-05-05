package com.parth.splitit.Expense;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("api/v1/groups/{group-id}/expenses")
@RequiredArgsConstructor
public class ExpenseController {
    private final ExpenseService service;

    @PostMapping("/create")
    public ResponseEntity<String> save(
            @RequestBody Expense expense) {
        return ResponseEntity.ok(service.save(expense));
    }

    @GetMapping
    public ResponseEntity<List<Expense>> findAllByGroupId(

            @PathVariable("group-id") String groupId) {
        return ResponseEntity.ok(service.findAllByGroupId(groupId));
    }

    @GetMapping("/{expense-id}")
    public ResponseEntity<Expense> findById(
            @PathVariable("expense-id") String expenseId) {
        return ResponseEntity.ok(service.findById(expenseId));
    }

    @DeleteMapping("/{expense-id}")
    public ResponseEntity<Void> delete(
            @PathVariable("expense-id") String expenseId) {
        service.delete(expenseId);
        return ResponseEntity.accepted().build();
    }

    @PutMapping("/{expense-id}")
    public ResponseEntity<Expense> putMethodName(@PathVariable("expense-id") String expenseId,
            @RequestBody Expense expense) {
        Expense updatedExpense = service.updateExpense(expenseId, expense);
        return ResponseEntity.ok(updatedExpense);

    }
}
