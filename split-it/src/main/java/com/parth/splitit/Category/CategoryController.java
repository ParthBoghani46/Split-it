package com.parth.splitit.Category;

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
@RequestMapping("api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService service;

    @PostMapping("/create")
    public ResponseEntity<String> save(
            @RequestBody Category category) {
        return ResponseEntity.ok(service.save(category));
    }

    @GetMapping
    public ResponseEntity<List<Category>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{category-id}")
    public ResponseEntity<Category> findById(
            @PathVariable("category-id") String expenseId) {
        return ResponseEntity.ok(service.findById(expenseId));
    }

    @DeleteMapping("/{category-id}")
    public ResponseEntity<Void> delete(
            @PathVariable("category-id") String expenseId) {
        service.delete(expenseId);
        return ResponseEntity.accepted().build();
    }
}
