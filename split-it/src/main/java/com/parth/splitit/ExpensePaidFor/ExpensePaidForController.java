package com.parth.splitit.ExpensePaidFor;

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

@RestController
@RequestMapping("api/v1/groups/{group-id}/expenses/{expense-id}/paidfor")
@RequiredArgsConstructor
public class ExpensePaidForController {
    private final ExpensePaidForService service;

    @PostMapping("/create")
    public ResponseEntity<String> save(
            @RequestBody ExpensePaidFor expensePaidFor) {
        return ResponseEntity.ok(service.save(expensePaidFor));
    }

    @GetMapping
    public ResponseEntity<List<ExpensePaidFor>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{expense-paidfor-id}")
    public ResponseEntity<ExpensePaidFor> findById(
            @PathVariable("expense-paidfor-id") String expensePadiForId) {
        return ResponseEntity.ok(service.findById(expensePadiForId));
    }

    @DeleteMapping("/{expense-paidfor-id}")
    public ResponseEntity<Void> delete(
            String expensePaidForId) {
        service.delete(expensePaidForId);
        return ResponseEntity.accepted().build();
    }

}
