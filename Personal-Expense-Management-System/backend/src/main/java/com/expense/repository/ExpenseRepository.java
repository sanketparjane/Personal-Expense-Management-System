package com.expense.repository;

import com.expense.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findAllByOrderByExpenseDateDesc();
    List<Expense> findByCategoryIgnoreCaseOrderByExpenseDateDesc(String category);

    @Query("SELECT e FROM Expense e WHERE LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(COALESCE(e.description, '')) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY e.expenseDate DESC")
    List<Expense> search(@Param("keyword") String keyword);
}
