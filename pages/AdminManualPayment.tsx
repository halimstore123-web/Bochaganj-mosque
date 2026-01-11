
import React, { useState, useMemo } from 'react';
import { getStoreData, addDonation, createAuditLog } from '../store';
import { User, DonationType, PaymentMethod, ReceiptTemplate } from '../types';

const AdminManualPayment: React.FC = () => {
  const [store, setStore] = useState(getStoreData());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [category, setCategory] = useState<DonationType>(DonationType.MONTHLY);
  const [template, setTemplate] = useState<ReceiptTemplate>(ReceiptTemplate.MODERN_QR);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredUsers = useMemo(() => 
    searchTerm.length >= 2 ? store.users.filter(u => 
      u.mobile_number.includes(searchTerm) || 
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()))
    ) : [],
    [searchTerm, store.users]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || amount <= 0) return alert('Invalid entry. Select member and enter amount.');

    setIsProcessing(true);
    setTimeout(() => {
      try {
        addDonation({
          userId: selectedUser.id,
          amount,
          type: category,
          method: method,
          performerId: 'admin_1',
          performerType: 'ADMIN',
          status: 'Paid',
          receiptTemplate: template
        });
        
        setStore(getStoreData());
        alert('Manual collection recorded. Digital receipt archived.');
        setSelectedUser(null);
        setAmount(0);
        setSearchTerm('');
      } catch (err) {
        alert('Failed to record entry.');
      } finally {
        setIsProcessing(false);
      }
    }, 1000);
  };

  return (
    <div className="p-4 md:p-10 max-w-4xl mx-auto animate-fadeIn bg-gray-50 min-h-screen font-sans">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-800 tracking-tighter uppercase leading-none">Counter Verification</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 ml-1">Manual Entry & Direct Receipt Generation</p>
        </div>
        <div className="bg-primary p-4 rounded-3xl text-white shadow-xl flex items-center gap-4">
           <i className="fas fa-user-shield text-accent text-xl"></i>
           <div className="pr-4 border-r border-white/10 mr-4">
             <p className="text-[8px] font-black uppercase opacity-60">Admin Token</p>
             <p className="text-xs font-black uppercase">AD-001_ACTIVE</p>
           </div>
           <p className="text-xs font-bold">{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-gray-100 relative overflow-hidden">
        <div className="mosque-pattern absolute inset-0 opacity-[0.03] pointer-events-none"></div>
        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
           <div className="relative">
              <label className="block text-[11px] font-black text-gray-400 uppercase mb-4 ml-6 tracking-[0.3em]">Search Registered Member</label>
              <div className="relative group">
                 <i className="fas fa-search absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 text-xl group-focus-within:text-primary transition-colors"></i>
                 <input 
                    type="text" 
                    className="w-full pl-20 pr-10 py-8 bg-gray-50 border-2 border-gray-100 rounded-[3rem] font-black text-2xl focus:border-primary outline-none transition-all focus:bg-white shadow-inner"
                    placeholder="Enter name or mobile..."
                    value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); if(selectedUser) setSelectedUser(null); }}
                 />
              </div>
              
              {filteredUsers.length > 0 && !selectedUser && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-2xl rounded-[3rem] border border-gray-100 mt-6 z-50 overflow-hidden animate-scaleIn">
                   {filteredUsers.map(u => (
                     <button key={u.id} type="button" onClick={() => { setSelectedUser(u); setSearchTerm(''); }} className="w-full p-8 flex justify-between items-center hover:bg-primary/5 transition-all border-b border-gray-50 last:border-0 group">
                        <div className="text-left">
                           <p className="font-black text-gray-800 text-2xl tracking-tighter leading-none mb-2 group-hover:text-primary transition-colors">{u.name}</p>
                           <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{u.mobile_number} • Wallet: {u.balance}৳</p>
                        </div>
                        <i className="fas fa-chevron-right text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0"></i>
                     </button>
                   ))}
                </div>
              )}
           </div>

           {selectedUser && (
             <div className="bg-emerald-950 p-10 rounded-[3.5rem] text-white flex justify-between items-center animate-slideDown shadow-2xl relative overflow-hidden group">
                <div className="mosque-pattern absolute inset-0 opacity-10"></div>
                <div className="relative z-10">
                  <h3 className="font-black text-4xl tracking-tighter leading-none mb-3">{selectedUser.name}</h3>
                  <div className="flex gap-6">
                     <span className="text-[10px] font-black uppercase text-accent border border-accent/20 px-4 py-1.5 rounded-xl">UID: {selectedUser.token_id}</span>
                     <span className="text-[10px] font-black uppercase text-white/50 tracking-widest mt-1.5">Asset Balance: {selectedUser.balance}৳</span>
                  </div>
                </div>
                <button type="button" onClick={() => setSelectedUser(null)} className="w-16 h-16 bg-white/10 hover:bg-red-600 rounded-[1.5rem] flex items-center justify-center transition-all relative z-10 shadow-xl">
                   <i className="fas fa-times text-2xl"></i>
                </button>
             </div>
           )}

           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                 <label className="block text-[11px] font-black text-gray-400 uppercase ml-6 tracking-[0.3em]">Verified Collection Amount</label>
                 <div className="relative">
                    <input 
                      type="number" 
                      required 
                      className="w-full px-12 py-10 bg-gray-50 border-2 border-gray-100 rounded-[3rem] font-black text-6xl text-primary outline-none focus:border-primary transition-all text-center shadow-inner tabular-nums"
                      value={amount || ''}
                      onChange={e => setAmount(Number(e.target.value))}
                      placeholder="000"
                    />
                    <span className="absolute right-12 top-1/2 -translate-y-1/2 text-primary/10 font-black text-4xl">BDT</span>
                 </div>
              </div>

              <div className="space-y-8">
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <label className="block text-[11px] font-black text-gray-400 uppercase mb-4 ml-4 tracking-widest">Entry Head</label>
                       <select className="w-full px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[2rem] font-black text-[10px] uppercase outline-none focus:border-primary appearance-none cursor-pointer" value={category} onChange={e => setCategory(e.target.value as DonationType)}>
                          {Object.values(DonationType).map(v => <option key={v} value={v}>{v}</option>)}
                       </select>
                    </div>
                    <div>
                       <label className="block text-[11px] font-black text-gray-400 uppercase mb-4 ml-4 tracking-widest">Audit Template</label>
                       <select className="w-full px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[2rem] font-black text-[10px] uppercase outline-none focus:border-primary appearance-none cursor-pointer" value={template} onChange={e => setTemplate(e.target.value as ReceiptTemplate)}>
                          {Object.values(ReceiptTemplate).map(v => <option key={v} value={v}>{v}</option>)}
                       </select>
                    </div>
                 </div>
                 <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase mb-4 ml-4 tracking-widest">Liquidity Method</label>
                    <select className="w-full px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[2rem] font-black text-[10px] uppercase outline-none focus:border-primary appearance-none cursor-pointer" value={method} onChange={e => setMethod(e.target.value as PaymentMethod)}>
                       {Object.values(PaymentMethod).map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                 </div>
              </div>
           </div>

           <button 
             disabled={isProcessing || !selectedUser || amount <= 0}
             className="w-full py-10 bg-primary text-white rounded-[3.5rem] font-black text-2xl uppercase tracking-[0.4em] shadow-2xl shadow-green-100 hover:bg-emerald-950 transition-all disabled:opacity-20 active:scale-95 flex items-center justify-center group"
           >
             {isProcessing ? <i className="fas fa-spinner fa-spin mr-6"></i> : (
               <>
                 <i className="fas fa-shield-check mr-6 group-hover:scale-125 transition-transform text-accent"></i>
                 Confirm & Sync Ledger
               </>
             )}
           </button>
           <p className="text-[9px] text-center font-black text-gray-300 uppercase tracking-[0.5em] mt-8">Secure administrative entry node • Timestamp: {new Date().toISOString()}</p>
        </form>
      </div>
    </div>
  );
};

export default AdminManualPayment;
