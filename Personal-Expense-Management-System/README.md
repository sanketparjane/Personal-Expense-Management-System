# Personal Expense Management System

A full-stack expense tracker using Java 21, Spring Boot, React, Vite, and MySQL.

## Features
- Create, view, edit, and delete expenses
- Search by title or description
- Filter by category
- Dashboard totals and transaction count
- REST API with request validation

> This is the first runnable version. Authentication and user-specific access are not yet implemented; add them before production use.

## Requirements
JDK 21, Maven 3.9+, Node.js 20+, and MySQL 8+.

## Setup
1. In MySQL Workbench run `CREATE DATABASE expense_manager;`.
2. Edit `backend/src/main/resources/application.properties` and replace `YOUR_MYSQL_PASSWORD`.
3. Start backend:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
4. In another terminal start frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
5. Open `http://localhost:5173`.

Backend health check: `http://localhost:8080/api/health`

## API
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/expenses` | List expenses; optional `?category=Food` or `?search=lunch` |
| GET | `/api/expenses/{id}` | Get one expense |
| POST | `/api/expenses` | Create |
| PUT | `/api/expenses/{id}` | Update |
| DELETE | `/api/expenses/{id}` | Delete |
| GET | `/api/health` | Health check |

Example request:
```json
{
  "title": "Lunch",
  "amount": 180.50,
  "category": "Food",
  "expenseDate": "2026-11-18",
  "description": "Lunch with friends"
}
```

## GitHub
Create a repository named `Personal-Expense-Management-System`, then run from this directory:
```bash
git init
git add .
git commit -m "Initial full-stack expense manager"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/Personal-Expense-Management-System.git
git push -u origin main
```
Never commit real passwords or `.env` files.
