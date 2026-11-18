package com.expense.service;

import com.expense.dto.ExpenseRequest;
import com.expense.entity.Expense;
import com.expense.repository.ExpenseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class ExpenseService {
    private final ExpenseRepository repository;

    public ExpenseService(ExpenseRepository repository) {
        this.repository = repository;
    }

    public List<Expense> getAll(String category, String search) {
        if (search != null && !search.isBlank()) return repository.search(search.trim());
        if (category != null && !category.isBlank())
            return repository.findByCategoryIgnoreCaseOrderByExpenseDateDesc(category.trim());
        return repository.findAllByOrderByExpenseDateDesc();
    }

    public Expense getById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expense not found"));
    }

    public Expense create(ExpenseRequest request) {
        return repository.save(new Expense(request.title().trim(), request.amount(),
            request.category().trim(), request.expenseDate(), request.description()));
    }

    public Expense update(Long id, ExpenseRequest request) {
        Expense expense = getById(id);
        expense.setTitle(request.title().trim());
        expense.setAmount(request.amount());
        expense.setCategory(request.category().trim());
        expense.setExpenseDate(request.expenseDate());
        expense.setDescription(request.description());
        return repository.save(expense);
    }

    public void delete(Long id) {
        repository.delete(getById(id));
    }
}
