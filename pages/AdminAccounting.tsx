
import React, { useState, useMemo } from 'react';
import { getStoreData, saveStoreData, createAuditLog } from '../store';
import { Expense, DonationType, ExpenseCategory } from '../types';

const AdminAccounting: React.FC = () => {
  const [store, setStore] = useState(getStoreData());
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState<any>({ category: 'General', description: '', amount: 0 });

  const totalIncome = store.donations.filter(d => d.status === 'Paid').reduce((s, d) => s + d.amount, 0);
  const totalExpense = store.expenses.reduce((s, e) => s + e.amount, 0);

  const ledgerItems = useMemo(() => {
    const incomes = store.donations.filter(d => d.status === 'Paid').map(d => ({ id: d.id, date: d.created_at, type: 'Credit', category: d.donation_type, description: `Donation: ${store.users.find(u => u.id === d.user_id)?.name}`, amount: d.amount, ref: d.transactionUid }));
    const outcomes = store.expenses.map(e => ({ id: e.id, date: e.expense_date, type: 'Debit', category: e.category, description: e.title, amount: e.amount, ref: e.id.slice(-8) }));
    return [...incomes, ...outcomes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [store.donations, store.expenses, store.users]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const expense: Expense = { id: `EXP_${Date.now()}`, title: newExpense.description, amount: newExpense.amount, expense_date: new Date().toISOString(), added_by_admin_id: 'admin_1', category: newExpense.category as ExpenseCategory, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    const data = getStoreData();
    data.expenses.unshift(expense);
    saveStoreData(data); setStore(data);
    createAuditLog('Expense', 'admin_1', 'ADMIN', `Expense: ${newExpense.amount}৳ (${newExpense.description})`);
    setShowExpenseModal(false); setNewExpense({ category: 'General', description: '', amount: 0 });
  };

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto font-sans">
      <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 text-center md:text-left">
        <div><h1 className="text-4xl font-black text-gray-800 tracking-tighter uppercase leading-none">Accounting Ledger</h1><p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-3">Monetary Control Command</p></div>
        <button onClick={() => setShowExpenseModal(true)} className="bg-red-600 text-white px-10 py-5 rounded-[2rem] font-black uppercase text-xs shadow-2xl active:scale-95"><i className="fas fa-minus-circle mr-3"></i> Debit New Expense</button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <LedgerCard title="Balance" value={totalIncome - totalExpense} color="text-primary" icon="fa-vault" />
        <LedgerCard title="Total Credits" value={totalIncome} color="text-emerald-600" icon="fa-arrow-trend-up" />
        <LedgerCard title="Total Debits" value={totalExpense} color="text-red-600" icon="fa-arrow-trend-down" />
      </div>
      <div className="bg-white rounded-[4rem] border border-gray-100 shadow-2xl overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <tr><th className="px-10 py-8">Date</th><th className="px-10 py-8">Category</th><th className="px-10 py-8">Narration</th><th className="px-10 py-8 text-right">Debit</th><th className="px-10 py-8 text-right">Credit</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ledgerItems.map(row => (
                <tr key={row.id} className="hover:bg-gray-50/50 group">
                  <td className="px-10 py-8 font-black text-gray-800 text-[10px] tabular-nums">{new Date(row.date).toLocaleDateString()}</td>
                  <td className="px-10 py-8"><span className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${row.type === 'Credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{row.category}</span></td>
                  <td className="px-10 py-8"><p className="font-black text-gray-800 leading-tight">{row.description}</p></td>
                  <td className="px-10 py-8 text-right">{row.type === 'Debit' ? <span className="font-black text-red-600 text-lg">-{row.amount}৳</span> : '-'}</td>
                  <td className="px-10 py-8 text-right">{row.type === 'Credit' ? <span className="font-black text-primary text-lg">+{row.amount}৳</span> : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-[200] p-6">
          <div className="bg-white w-full max-w-xl rounded-[4rem] p-16 shadow-2xl">
            <h2 className="text-3xl font-black mb-12 text-center uppercase">Debit Voucher</h2>
            <form onSubmit={handleAddExpense} className="space-y-10">
              <input required className="w-full px-10 py-6 bg-gray-50 border-2 border-gray-100 rounded-[2.5rem] font-black focus:border-red-600 outline-none" placeholder="Purpose..." value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} />
              <div className="grid grid-cols-2 gap-8">
                <select className="w-full px-8 py-5 bg-gray-50 rounded-[2rem] font-black text-[10px] uppercase appearance-none" value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})}><option>General</option><option>Imam Salary</option><option>Staff Salary</option><option>Electricity</option></select>
                <input type="number" required className="w-full px-10 py-5 bg-gray-50 rounded-[2rem] font-black text-3xl text-red-600 text-center" placeholder="000" value={newExpense.amount || ''} onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})} />
              </div>
              <div className="flex gap-6"><button type="button" onClick={() => setShowExpenseModal(false)} className="flex-1 py-7 bg-gray-100 rounded-[2.5rem] font-black uppercase text-xs">Cancel</button><button type="submit" className="flex-1 py-7 bg-red-600 text-white rounded-[2.5rem] font-black uppercase text-xs">Confirm</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const LedgerCard = ({ title, value, icon, color }: any) => (
  <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm group hover:shadow-2xl transition-all">
    <div className={`${color} bg-gray-50 w-20 h-20 flex items-center justify-center rounded-[2rem] text-3xl mb-10 group-hover:bg-primary group-hover:text-white transition-all`}><i className={`fas ${icon}`}></i></div>
    <p className="text-[11px] text-gray-400 font-black uppercase mb-3 tracking-widest">{title}</p>
    <h3 className={`text-4xl font-black ${color} tracking-tighter tabular-nums`}>{value.toLocaleString()}৳</h3>
  </div>
);

export default AdminAccounting;
