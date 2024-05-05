package com.parth.splitit.Participant;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.parth.splitit.Expense.Expense;
import com.parth.splitit.ExpensePaidFor.ExpensePaidFor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "participants")
public class Participant {
    @Id
    private String id;
    private String name;
    private String groupId;
    private List<Expense> expensesPaidBy;
    private List<ExpensePaidFor> expensesPaidFor;
}