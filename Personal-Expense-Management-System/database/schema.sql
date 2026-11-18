CREATE DATABASE IF NOT EXISTS expense_manager;
USE expense_manager;

-- Hibernate creates this table automatically when the backend starts.
CREATE TABLE IF NOT EXISTS expenses (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  expense_date DATE NOT NULL,
  description VARCHAR(500)
);
