package com.parth.splitit.Group;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.annotation.Id;

import com.parth.splitit.Expense.Expense;
import com.parth.splitit.Participant.Participant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Group {
    @Id
    private String id;
    private String name;
    @Builder.Default
    private String currency = "$";
    private List<Participant> participants;
    private List<Expense> expenses;
    @Builder.Default
    private LocalDate createdAt = LocalDate.now();

}
