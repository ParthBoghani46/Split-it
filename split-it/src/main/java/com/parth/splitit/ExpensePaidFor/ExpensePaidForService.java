package com.parth.splitit.ExpensePaidFor;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpensePaidForService {
    private final ExpensePaidForRepository repository;

    public String save(ExpensePaidFor expensePaidFor) {

        return repository.save(expensePaidFor).getId();
    }

    public ExpensePaidFor findById(String id) {
        return repository.findById(id).orElse(null);
    }

    public List<ExpensePaidFor> findAll() {
        return repository.findAll();
    }

    public void delete(String id) {
        repository.deleteById(id);
    }
}
