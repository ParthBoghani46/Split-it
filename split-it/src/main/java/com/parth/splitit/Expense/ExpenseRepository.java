package com.parth.splitit.Expense;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ExpenseRepository extends MongoRepository<Expense, String> {

    List<Expense> findAllByGroupId(String groupId);

}
