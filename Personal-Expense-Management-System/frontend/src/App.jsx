import { useEffect, useMemo, useState } from 'react'
import { Wallet, TrendingDown, CalendarDays, Plus, Search, Trash2, Pencil, X, ArrowUpRight, ReceiptText, RefreshCw } from 'lucide-react'
import { expenseService } from './services/expenseService'

const today = new Date().toISOString().slice(0, 10)
const emptyForm = { title: '', amount: '', category: 'Food', expenseDate: today, description: '' }
const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Education', 'Entertainment', 'Other']
const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(value || 0))

export default function App() {
  const [expenses, setExpenses] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  async function loadExpenses() {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (category !== 'All') params.set('category', category)
      if (search.trim()) params.set('search', search.trim())
      const query = params.toString()
      setExpenses(await expenseService.getAll(query ? `?${query}` : ''))
    } catch (err) {
      setError(`${err.message}. Check that Spring Boot and MySQL are running.`)
    } finally { setLoading(false) }
  }

  useEffect(() => {
    const timer = setTimeout(loadExpenses, 250)
    return () => clearTimeout(timer)
  }, [category, search])

  const total = useMemo(() => expenses.reduce((sum, item) => sum + Number(item.amount), 0), [expenses])
  const monthTotal = useMemo(() => {
    const month = new Date().toISOString().slice(0, 7)
    return expenses.filter(item => item.expenseDate?.startsWith(month)).reduce((sum, item) => sum + Number(item.amount), 0)
  }, [expenses])
  const categoryCount = new Set(expenses.map(item => item.category)).size

  function changeField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }
  function addExpense() {
    setEditingId(null); setForm(emptyForm); setShowForm(true)
  }
  function editExpense(item) {
    setEditingId(item.id)
    setForm({ title: item.title, amount: item.amount, category: item.category, expenseDate: item.expenseDate, description: item.description || '' })
    setShowForm(true)
  }
  async function submit(event) {
    event.preventDefault(); setSaving(true); setError('')
    const payload = { ...form, amount: Number(form.amount) }
    try {
      if (editingId) await expenseService.update(editingId, payload)
      else await expenseService.create(payload)
      setShowForm(false); setForm(emptyForm); setEditingId(null)
      await loadExpenses()
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }
  async function deleteExpense(id) {
    if (!window.confirm('Delete this expense?')) return
    try { await expenseService.remove(id); await loadExpenses() }
    catch (err) { setError(err.message) }
  }

  return <main className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-icon"><Wallet size={21}/></div><span>Expense<span className="brand-light">Flow</span></span></div>
      <div className="side-label">WORKSPACE</div>
      <div className="side-link active"><ReceiptText size={18}/> Overview</div>
      <div className="side-note"><div className="note-icon"><TrendingDown size={17}/></div><strong>Small steps add up.</strong><p>Keep your spending visible and make informed decisions.</p></div>
      <div className="sidebar-footer">PERSONAL FINANCE TRACKER</div>
    </aside>

    <section className="main-content">
      <header className="topbar">
        <div><div className="eyebrow">YOUR FINANCES</div><h1>Expense overview</h1><p className="subtitle">A clear picture of where your money goes.</p></div>
        <button className="primary-btn" onClick={addExpense}><Plus size={18}/> Add expense</button>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <section className="stats-grid">
        <article className="stat-card"><div className="stat-top"><span>Total shown</span><div className="stat-icon purple"><Wallet size={18}/></div></div><strong>{money(total)}</strong><small>Based on current list and filters</small></article>
        <article className="stat-card"><div className="stat-top"><span>This month</span><div className="stat-icon green"><CalendarDays size={18}/></div></div><strong>{money(monthTotal)}</strong><small>Current calendar month</small></article>
        <article className="stat-card"><div className="stat-top"><span>Transactions</span><div className="stat-icon orange"><ReceiptText size={18}/></div></div><strong>{expenses.length}</strong><small>Expenses in the current list</small></article>
        <article className="stat-card"><div className="stat-top"><span>Categories</span><div className="stat-icon blue"><ArrowUpRight size={18}/></div></div><strong>{categoryCount}</strong><small>Categories represented</small></article>
      </section>

      <section className="list-panel">
        <div className="panel-heading"><div><h2>Recent transactions</h2><p>Manage and review your expenses.</p></div><button className="icon-btn" onClick={loadExpenses} title="Refresh"><RefreshCw size={17}/></button></div>
        <div className="toolbar">
          <label className="search-box"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search expenses..."/></label>
          <select value={category} onChange={e => setCategory(e.target.value)} aria-label="Filter by category"><option value="All">All categories</option>{categories.map(item => <option key={item}>{item}</option>)}</select>
        </div>
        <div className="table-wrap"><table>
          <thead><tr><th>EXPENSE</th><th>CATEGORY</th><th>DATE</th><th>AMOUNT</th><th>ACTIONS</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="5" className="empty-state">Loading expenses...</td></tr> :
              expenses.length === 0 ? <tr><td colSpan="5" className="empty-state">No expenses found. Add your first transaction.</td></tr> :
              expenses.map(item => <tr key={item.id}>
                <td><div className="expense-title">{item.title}</div><div className="expense-desc">{item.description || 'No description'}</div></td>
                <td><span className="category-pill">{item.category}</span></td><td>{item.expenseDate}</td><td className="amount">{money(item.amount)}</td>
                <td><div className="actions"><button className="icon-btn" onClick={() => editExpense(item)} title="Edit"><Pencil size={16}/></button><button className="icon-btn danger" onClick={() => deleteExpense(item.id)} title="Delete"><Trash2 size={16}/></button></div></td>
              </tr>)
            }
          </tbody>
        </table></div>
      </section>
      <footer className="page-footer">ExpenseFlow <span>·</span> Built with React, Spring Boot &amp; MySQL</footer>
    </section>

    {showForm && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setShowForm(false)}>
      <section className="modal">
        <div className="modal-heading"><div><div className="eyebrow">{editingId ? 'UPDATE RECORD' : 'NEW RECORD'}</div><h2>{editingId ? 'Edit expense' : 'Add an expense'}</h2></div><button className="icon-btn" onClick={() => setShowForm(false)}><X size={19}/></button></div>
        <form onSubmit={submit}>
          <label>Title<input name="title" value={form.title} onChange={changeField} required maxLength="100" placeholder="e.g. Grocery shopping"/></label>
          <div className="form-row">
            <label>Amount (₹)<input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={changeField} required placeholder="0.00"/></label>
            <label>Category<select name="category" value={form.category} onChange={changeField}>{categories.map(item => <option key={item}>{item}</option>)}</select></label>
          </div>
          <label>Date<input name="expenseDate" type="date" value={form.expenseDate} onChange={changeField} required/></label>
          <label>Description <span className="optional">(optional)</span><textarea name="description" value={form.description} onChange={changeField} maxLength="500" rows="3" placeholder="Add a short note..."/></label>
          <div className="modal-actions"><button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button><button type="submit" className="primary-btn" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Save changes' : 'Add expense'}</button></div>
        </form>
      </section>
    </div>}
  </main>
}
