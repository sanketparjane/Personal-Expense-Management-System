package com.expense.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseRequest(
    @NotBlank(message = "Title is required")
    @Size(max = 100) String title,

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    @Digits(integer = 10, fraction = 2) BigDecimal amount,

    @NotBlank(message = "Category is required")
    @Size(max = 50) String category,

    @NotNull(message = "Expense date is required") LocalDate expenseDate,

    @Size(max = 500) String description
) {}
