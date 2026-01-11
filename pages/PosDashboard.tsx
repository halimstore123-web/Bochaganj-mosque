
import React, { useState, useMemo, useEffect } from 'react';
import { User, DonationType, PaymentMethod, ReceiptTemplate, UserRole, UserType, UserTag, ExpenseCategory } from '../types';
import { getStoreData, addDonation, generatePdfReceipt, saveStoreData, createAuditLog, getOrCreateUser } from '../store';

interface PosDashboardProps {
  user: User;
  onLogout: () => void;
}

const PosDashboard: React.FC<PosDashboardProps> = ({ user, onLogout }) => {
  const [store, setStore] = useState(getStoreData());
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<DonationType>(DonationType.MONTHLY);
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [template, setTemplate] = useState<ReceiptTemplate>(ReceiptTemplate.POS_MINI);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Modals
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', phone: '', initialBalance: 0 });
  const [expenseData, setExpenseData] = useState({ title: '', amount: 0, cat: 'Maintenance' as ExpenseCategory });

  const shiftStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const myTxns = store.donations.filter(t => t.collectorName === user.id && t.created_at.startsWith(today));
    const total = myTxns.reduce((sum, t) => sum + t.amount, 0);
    return { total, count: myTxns.length, txns: myTxns };
  }, [store.donations, user.id]);

  const filteredUsers = useMemo(() => 
    search.length >= 3 ? store.users.filter(u => u.mobile_number.includes(search) || u.name?.toLowerCase().includes(search.toLowerCase())) : [],
    [search, store.users]
  );

  const t = {
    en: {
      collection: "New Collection",
      expense: "Log Expense",
      logout: "Exit Terminal",
      searchPlaceholder: "Mobile / ID Search...",
      newMember: "Register New Member",
      amount: "Amount (BDT)",
      confirm: "Confirm & Print",
      shiftTotal: "Current Shift Volume",
      recent: "Recent Tape",
      balance: "Balance",
      fund: "Allocation",
      method: "Method",
      template: "Format"
    },
    bn: {
      collection: "নতুন কালেকশন",
      expense: "খরচ এন্টি",
      logout: "লগআউট",
      searchPlaceholder: "মোবাইল / আইডি খুঁজুন...",
      newMember: "নতুন সদস্য",
      amount: "টাকার পরিমাণ",
      confirm: "কনফার্ম ও প্রিন্ট",
      shiftTotal: "আজকের মোট কালেকশন",
      recent: "সাম্প্রতিক লেনদেন",
      balance: "ব্যালেন্স",
      fund: "ফান্ড টাইপ",
      method: "পেমেন্ট মাধ্যম",
      template: "রশিদ টাইপ"
    }
  }[lang];

  const handleProcessDonation = () => {
    if (!selectedUser || amount <= 0) return alert('সঠিক তথ্য দিন।');
    setIsProcessing(true);
    
    setTimeout(() => {
      const donation = addDonation({
        userId: selectedUser.id,
        amount,
        type: category,
        method: method,
        performerId: user.id,
        performerType: 'POS',
        status: 'Paid',
        receiptTemplate: template
      });
      
      const updatedStore = getStoreData();
      setStore(updatedStore);
      generatePdfReceipt(donation, selectedUser, updatedStore.settings);
      
      setIsProcessing(false); 
      setSelectedUser(null); 
      setAmount(0); 
      setSearch('');
    }, 600);
  };

  const handleQuickRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserData.phone.length < 11) return alert('সঠিক ফোন নম্বর দিন');
    
    const newUser = getOrCreateUser(newUserData.phone);
    const data = getStoreData();
    const updated = data.users.find(u => u.id === newUser.id);
    if (updated) {
      updated.name = newUserData.name || 'Donor';
      updated.balance = newUserData.initialBalance;
    }
    saveStoreData(data);
    
    setStore(getStoreData());
    setSelectedUser(updated || newUser);
    setShowNewUserModal(false);
    setNewUserData({ name: '', phone: '', initialBalance: 0 });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col no-print selection:bg-accent selection:text-black">
      {/* High-Speed POS Header */}
      <header className="flex justify-between items-center bg-zinc-900 p-6 border-b border-white/5 sticky top-0 z-[100] shadow-2xl">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg border border-emerald-500/50 animate-pulse">
            <i className="fas fa-terminal"></i>
          </div>
          <div>
            <h1 className="text-lg font-black uppercase tracking-tighter text-emerald-400 leading-none">Terminal: {user.name}</h1>
            <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.5em] mt-1.5 flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Ledger Sync: Active
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={() => setLang(l => l === 'bn' ? 'en' : 'bn')} className="bg-white/5 px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-white/5 hover:bg-white/10 transition-all">
            {lang === 'bn' ? 'English' : 'বাংলা'}
          </button>
          <div className="w-px h-6 bg-white/10 mx-2"></div>
          <button onClick={() => setShowExpenseModal(true)} className="bg-red-500/10 text-red-400 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">
            <i className="fas fa-minus-circle mr-2"></i> {t.expense}
          </button>
          <button onClick={onLogout} className="bg-white/5 text-white/40 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all">
             <i className="fas fa-power-off"></i>
          </button>
        </div>
      </header>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-hidden">
        {/* Transaction Console */}
        <div className="lg:col-span-8 space-y-6 flex flex-col">
          <div className="bg-zinc-900 rounded-[3rem] p-10 border border-white/5 shadow-2xl flex-grow relative overflow-hidden flex flex-col">
            <div className="mosque-pattern absolute inset-0 opacity-5 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              {/* Universal Search Box */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-4 px-4">
                  <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em]">{t.searchPlaceholder}</label>
                  <button onClick={() => setShowNewUserModal(true)} className="text-[10px] font-black text-accent uppercase tracking-widest hover:text-white transition-colors">
                    <i className="fas fa-plus mr-1"></i> {t.newMember}
                  </button>
                </div>
                <div className="relative group">
                  <i className="fas fa-search absolute left-8 top-1/2 -translate-y-1/2 text-white/10 text-2xl group-focus-within:text-accent transition-colors"></i>
                  <input 
                    className="w-full pl-20 pr-10 py-7 bg-black rounded-[2.5rem] border-2 border-transparent focus:border-accent outline-none font-black text-4xl transition-all shadow-inner placeholder:text-zinc-800" 
                    placeholder="Search ID/Mobile..." 
                    autoFocus
                    value={search} 
                    onChange={e => { setSearch(e.target.value); if(selectedUser) setSelectedUser(null); }} 
                  />
                </div>
                
                {filteredUsers.length > 0 && !selectedUser && (
                  <div className="absolute z-50 left-8 right-8 bg-zinc-800 border border-white/10 rounded-[2.5rem] mt-2 shadow-2xl overflow-hidden animate-scaleIn">
                    {filteredUsers.map(u => (
                      <button key={u.id} onClick={() => { setSelectedUser(u); setSearch(''); }} className="w-full p-8 hover:bg-accent hover:text-primary transition-all flex justify-between items-center text-left border-b border-white/5 last:border-0 group">
                        <div>
                          <p className="font-black text-2xl tracking-tighter group-hover:scale-105 transition-transform">{u.name || 'Anonymous'}</p>
                          <p className="text-[10px] opacity-60 uppercase font-black tracking-widest">{u.mobile_number} • BAL: {u.balance}৳</p>
                        </div>
                        <i className="fas fa-arrow-right opacity-0 group-hover:opacity-100 transition-opacity"></i>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Transaction Workflow */}
              {selectedUser ? (
                <div className="animate-fadeIn space-y-10 flex-grow flex flex-col">
                  <div className="p-8 bg-emerald-900/20 rounded-[2rem] border border-emerald-500/10 flex justify-between items-center shadow-inner">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent text-3xl">
                          <i className="fas fa-user-check"></i>
                       </div>
                       <div>
                          <h3 className="text-3xl font-black tracking-tighter text-emerald-400 leading-none mb-2">{selectedUser.name}</h3>
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{selectedUser.mobile_number} • {t.balance}: {selectedUser.balance}৳</p>
                       </div>
                    </div>
                    <button onClick={() => setSelectedUser(null)} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-red-600 transition-all">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="block text-[11px] font-black text-white/20 uppercase tracking-widest ml-6">{t.amount}</label>
                      <input 
                        type="number" 
                        className="w-full px-10 py-10 bg-black rounded-3xl border-2 border-transparent focus:border-accent outline-none font-black text-7xl text-center text-accent shadow-inner tabular-nums" 
                        placeholder="000" 
                        autoFocus
                        value={amount || ''} 
                        onChange={e => setAmount(Number(e.target.value))} 
                        onKeyDown={e => e.key === 'Enter' && amount > 0 && handleProcessDonation()}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-white/10 uppercase ml-4">{t.fund}</label>
                        <select className="w-full px-6 py-4 bg-black rounded-2xl border border-white/5 focus:border-accent outline-none font-black text-xs uppercase appearance-none" value={category} onChange={e => setCategory(e.target.value as any)}>
                          {Object.values(DonationType).map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-white/10 uppercase ml-4">{t.method}</label>
                          <select className="w-full px-6 py-4 bg-black rounded-2xl border border-white/5 focus:border-accent outline-none font-black text-[10px] uppercase appearance-none" value={method} onChange={e => setMethod(e.target.value as any)}>
                            {Object.values(PaymentMethod).map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-white/10 uppercase ml-4">{t.template}</label>
                          <select className="w-full px-6 py-4 bg-black rounded-2xl border border-white/5 focus:border-accent outline-none font-black text-[10px] uppercase appearance-none" value={template} onChange={e => setTemplate(e.target.value as any)}>
                            {Object.values(ReceiptTemplate).map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleProcessDonation} 
                    disabled={isProcessing || amount <= 0} 
                    className="w-full py-10 mt-auto rounded-[2.5rem] font-black text-3xl uppercase tracking-[0.5em] shadow-2xl transition-all active:scale-95 bg-accent text-primary hover:bg-yellow-400 disabled:opacity-10 flex items-center justify-center gap-6"
                  >
                    {isProcessing ? <i className="fas fa-spinner fa-spin"></i> : (
                      <>
                        <i className="fas fa-print"></i> 
                        {t.confirm}
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center opacity-5 select-none grayscale">
                  <i className="fas fa-cash-register text-[15rem] mb-12"></i>
                  <h4 className="text-4xl font-black uppercase tracking-[0.6em]">Terminal Standby</h4>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="lg:col-span-4 space-y-6 flex flex-col h-full">
          {/* Shift Stats */}
          <div className="bg-zinc-900 rounded-[3rem] p-10 border border-white/5 shadow-2xl">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-8 border-b border-white/5 pb-4 flex justify-between">
              <span>{t.shiftTotal}</span>
              <span className="text-accent animate-pulse">● LIVE</span>
            </h4>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-black/40 p-8 rounded-3xl border border-white/5 text-center shadow-inner">
                 <p className="text-[9px] font-black uppercase text-white/20 mb-2">Total Vol</p>
                 <p className="text-4xl font-black text-accent tabular-nums">{shiftStats.total}৳</p>
              </div>
              <div className="bg-black/40 p-8 rounded-3xl border border-white/5 text-center shadow-inner">
                 <p className="text-[9px] font-black uppercase text-white/20 mb-2">Receipts</p>
                 <p className="text-4xl font-black text-white tabular-nums">{shiftStats.count}</p>
              </div>
            </div>
          </div>

          {/* History Tape */}
          <div className="bg-zinc-900 rounded-[3rem] p-10 border border-white/5 shadow-2xl flex-grow flex flex-col min-h-0">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-6 border-b border-white/5 pb-4">{t.recent}</h4>
            <div className="space-y-4 overflow-y-auto custom-scrollbar flex-grow pr-2">
              {shiftStats.txns.map(t => (
                <div key={t.id} onClick={() => {
                  const u = store.users.find(usr => usr.id === t.user_id);
                  if(u) generatePdfReceipt(t, u, store.settings);
                }} className="bg-white/5 p-6 rounded-2xl border border-white/5 flex justify-between items-center group hover:bg-emerald-500/10 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center text-accent text-sm group-hover:scale-110 transition-transform"><i className="fas fa-receipt"></i></div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-tighter leading-none mb-1">{store.users.find(u => u.id === t.user_id)?.name || 'Guest'}</p>
                      <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">{new Date(t.created_at).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <p className="font-black text-emerald-400 text-xl tabular-nums">+{t.amount}৳</p>
                </div>
              ))}
              {shiftStats.txns.length === 0 && (
                <div className="py-20 text-center opacity-10 flex flex-col items-center">
                   <i className="fas fa-history text-5xl mb-6"></i>
                   <p className="text-[10px] font-black uppercase tracking-widest">No Recent Shifts</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New User Modal */}
      {showNewUserModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl flex items-center justify-center z-[200] p-6 animate-fadeIn">
          <div className="bg-zinc-900 w-full max-w-lg rounded-[4rem] p-12 shadow-2xl border border-white/10 relative">
             <div className="mosque-pattern absolute inset-0 opacity-5 pointer-events-none"></div>
             <h2 className="text-3xl font-black mb-10 text-center uppercase tracking-tighter text-accent relative z-10">Register Profile</h2>
             <form onSubmit={handleQuickRegister} className="space-y-8 relative z-10">
                <div className="group">
                   <label className="block text-[11px] font-black text-white/30 uppercase mb-3 ml-6">Full Identity Name</label>
                   <input required className="w-full px-8 py-5 bg-black rounded-2xl border-2 border-transparent focus:border-accent outline-none font-bold text-white transition-all shadow-inner" value={newUserData.name} onChange={e => setNewUserData({...newUserData, name: e.target.value})} />
                </div>
                <div className="group">
                   <label className="block text-[11px] font-black text-white/30 uppercase mb-3 ml-6">Phone (Unique ID)</label>
                   <input required type="tel" className="w-full px-8 py-5 bg-black rounded-2xl border-2 border-transparent focus:border-accent outline-none font-black text-2xl text-white transition-all shadow-inner" placeholder="01XXXXXXXXX" value={newUserData.phone} onChange={e => setNewUserData({...newUserData, phone: e.target.value})} />
                </div>
                <div className="group">
                   <label className="block text-[11px] font-black text-white/30 uppercase mb-3 ml-6">Initial Balance (৳)</label>
                   <input type="number" className="w-full px-8 py-5 bg-black rounded-2xl border-2 border-transparent focus:border-accent outline-none font-black text-2xl text-emerald-400 transition-all shadow-inner" value={newUserData.initialBalance || ''} onChange={e => setNewUserData({...newUserData, initialBalance: Number(e.target.value)})} />
                </div>
                <div className="flex gap-4 pt-6">
                   <button type="button" onClick={() => setShowNewUserModal(false)} className="flex-1 py-7 bg-white/5 rounded-3xl font-black uppercase text-xs hover:bg-white/10 transition-all">Discard</button>
                   <button type="submit" className="flex-1 py-7 bg-accent text-primary rounded-3xl font-black uppercase text-xs shadow-2xl hover:bg-yellow-400 transition-all">Create Node</button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl flex items-center justify-center z-[200] p-6 animate-fadeIn">
          <div className="bg-zinc-900 w-full max-w-lg rounded-[4rem] p-12 shadow-2xl border border-white/10 relative">
             <div className="mosque-pattern absolute inset-0 opacity-5 pointer-events-none"></div>
             <h2 className="text-3xl font-black mb-10 text-center uppercase tracking-tighter text-red-500 relative z-10">Record Debit</h2>
             <form onSubmit={(e) => {
                e.preventDefault();
                if(expenseData.amount <= 0) return;
                const data = getStoreData();
                data.expenses.unshift({
                  id: `EXP_${Date.now()}`,
                  title: expenseData.title,
                  amount: expenseData.amount,
                  category: expenseData.cat,
                  expense_date: new Date().toISOString(),
                  added_by_admin_id: user.id,
                  added_by_name: user.name,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                });
                saveStoreData(data);
                setStore(data);
                createAuditLog('Expense', user.id, 'POS', `Terminal Debit: ${expenseData.amount} BDT for ${expenseData.title}`);
                setShowExpenseModal(false);
                setExpenseData({ title: '', amount: 0, cat: 'Maintenance' });
                alert('খরচ সংরক্ষিত হয়েছে।');
             }} className="space-y-6 relative z-10">
                <div>
                   <label className="block text-[11px] font-black text-white/30 uppercase mb-3 ml-6">Narration / Purpose</label>
                   <input required className="w-full px-8 py-5 bg-black rounded-2xl border-2 border-transparent focus:border-red-500 outline-none font-bold text-white transition-all shadow-inner" value={expenseData.title} onChange={e => setExpenseData({...expenseData, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-[11px] font-black text-white/30 uppercase mb-3 ml-6">Amount (৳)</label>
                      <input type="number" required className="w-full px-8 py-5 bg-black rounded-2xl outline-none font-black text-2xl text-red-500 shadow-inner" value={expenseData.amount || ''} onChange={e => setExpenseData({...expenseData, amount: Number(e.target.value)})} />
                   </div>
                   <div>
                      <label className="block text-[11px] font-black text-white/30 uppercase mb-3 ml-6">Category</label>
                      <select className="w-full px-8 py-5 bg-black rounded-2xl font-black text-[10px] uppercase appearance-none" value={expenseData.cat} onChange={e => setExpenseData({...expenseData, cat: e.target.value as any})}>
                         <option value="Maintenance">Maintenance</option>
                         <option value="Electricity">Electricity</option>
                         <option value="Staff Salary">Staff Salary</option>
                      </select>
                   </div>
                </div>
                <div className="flex gap-4 pt-6">
                   <button type="button" onClick={() => setShowExpenseModal(false)} className="flex-1 py-7 bg-white/5 rounded-3xl font-black uppercase text-xs">Cancel</button>
                   <button type="submit" className="flex-1 py-7 bg-red-600 text-white rounded-3xl font-black uppercase text-xs shadow-2xl border-b-8 border-red-900 active:translate-y-1">Authorize Debit</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PosDashboard;
