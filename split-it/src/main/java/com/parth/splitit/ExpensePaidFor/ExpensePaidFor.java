package com.parth.splitit.ExpensePaidFor;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;

import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "expenses_paid_for")
public class ExpensePaidFor {
    @Id
    private String id;
    private String expenseId;
    private String participantId;

    @Builder.Default
    private Integer shares = 1;

}
