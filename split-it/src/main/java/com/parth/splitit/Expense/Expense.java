package com.parth.splitit.Expense;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.parth.splitit.ExpensePaidFor.ExpensePaidFor;
import com.parth.splitit.SplitMode.SplitMode;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "expenses")
public class Expense {
    @Id
    private String id;

    public String groupId;

    private LocalDate expenseDate;

    private String title;

    private Integer amount;

    private String categoryId;

    private String paidBy;

    private List<ExpensePaidFor> paidFor;

    @Builder.Default
    private Boolean isReimbursement = false;
    @Builder.Default
    private SplitMode splitMode = SplitMode.EVENLY;
    @Builder.Default
    private LocalDate createdAt = LocalDate.now();
    private String notes;

    public void removePaidForEntries(List<ExpensePaidFor> paidForList) {
        this.paidFor.removeAll(paidForList);
    }
}
