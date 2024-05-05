package com.parth.splitit.Expense;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.parth.splitit.ExpensePaidFor.ExpensePaidFor;
import com.parth.splitit.ExpensePaidFor.ExpensePaidForRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpenseService {
    private final ExpenseRepository repository;

    private final ExpensePaidForRepository expensePaidForRepository;

    public String save(Expense expense) {

        for (ExpensePaidFor expensePaidFor : expense.getPaidFor()) {
            expensePaidForRepository.save(expensePaidFor);
        }

        String expenseId = repository.save(expense).getId();

        return expenseId;
    }

    public Expense findById(String id) {
        return repository.findById(id).orElse(null);
    }

    public List<Expense> findAll() {
        return repository.findAll();
    }

    public void delete(String expenseId) {
        Expense expense = repository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + expenseId));

        for (ExpensePaidFor expensePaidFor : expense.getPaidFor()) {
            expensePaidForRepository.deleteById(expensePaidFor.getId());
        }

        repository.deleteById(expenseId);
    }

    public List<Expense> findAllByGroupId(String groupId) {
        return repository.findAllByGroupId(groupId);
    }

    public Expense updateExpense(String id, Expense updatedExpense) {
        // Find the existing expense by its ID
        Optional<Expense> optionalExistingExpense = repository.findById(id);
        if (optionalExistingExpense.isPresent()) {

            Expense existingExpense = optionalExistingExpense.get();
            existingExpense.setExpenseDate(updatedExpense.getExpenseDate());
            existingExpense.setTitle(updatedExpense.getTitle());
            existingExpense.setAmount(updatedExpense.getAmount());
            existingExpense.setCategoryId(updatedExpense.getCategoryId());
            existingExpense.setPaidBy(updatedExpense.getPaidBy());
            existingExpense.setPaidFor(updatedExpense.getPaidFor());
            existingExpense.setIsReimbursement(updatedExpense.getIsReimbursement());
            existingExpense.setSplitMode(updatedExpense.getSplitMode());
            existingExpense.setNotes(updatedExpense.getNotes());
            return repository.save(existingExpense);
        }
        return null;

    }
}
