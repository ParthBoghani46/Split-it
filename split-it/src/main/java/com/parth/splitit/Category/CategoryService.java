package com.parth.splitit.Category;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository repository;

    public String save(Category category) {
        return repository.save(category).getId();
    }

    public Category findById(String id) {
        return repository.findById(id).orElse(null);
    }

    public List<Category> findAll() {
        return repository.findAll();
    }

    public void delete(String id) {
        repository.deleteById(id);
    }

}