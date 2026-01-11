
import React, { useState } from 'react';
import { getStoreData, saveStoreData, createAuditLog } from '../store';
// Added UserTag to the import list to fix the missing type error
import { User, UserRole, UserType, UserTag } from '../types';

const AdminPosControl: React.FC = () => {
  const [store, setStore] = useState(getStoreData());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPos, setNewPos] = useState({
    name: '',
    phone: '',
    pin: ''
  });

  const posUsers = store.users.filter(u => u.role === UserRole.POS);

  const handleAddPos = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newPos.phone || !newPos.pin) return;

    const posUser: User = {
      id: `pos_${Date.now()}`,
      token_id: newPos.phone,
      mobile_number: newPos.phone,
      phone: newPos.phone,
      name: newPos.name,
      role: UserRole.POS,
      balance: 0,
      total_contributed: 0,
      assigned_monthly_amount: 0,
      status: 'Active',
      auto_invoice_enabled: false,
      user_type: UserType.REGULAR,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      posPin: newPos.pin,
      tags: [UserTag.REGULAR]
    };

    const newStore = { ...store, users: [...store.users, posUser] };
    saveStoreData(newStore);
    setStore(newStore);
    createAuditLog('POS_Action', 'admin_1', 'ADMIN', `Initialized terminal operator: ${newPos.name}`);
    setShowAddModal(false);
    setNewPos({ name: '', phone: '', pin: '' });
  };

  const setTransactionLimit = (id: string) => {
    const limit = prompt("Set Daily Transaction Limit (৳):");
    if (limit) {
      createAuditLog('POS_Action', 'admin_1', 'ADMIN', `Updated transaction limit for Terminal Node ${id} to ${limit} BDT`);
      alert("Limit successfully provisioned.");
    }
  };

  const remoteLock = (id: string, name: string) => {
    if (window.confirm(`SECURITY PROTOCOL: Remote lock terminal operator ${name}? Access will be immediately revoked.`)) {
      const newStore = { ...store, users: store.users.map(u => u.id === id ? { ...u, status: 'Inactive' as any } : u) };
      saveStoreData(newStore);
      setStore(newStore);
      createAuditLog('Security', 'admin_1', 'ADMIN', `REMOTE LOCK ENGAGED: Revoked terminal access for node ${name}`);
    }
  };

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto animate-fadeIn font-sans min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div>
          <h1 className="text-4xl font-black text-gray-800 tracking-tighter uppercase leading-none">Terminal Command</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4 ml-1">Remote Access & Authorization Control Center</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-950 text-white px-10 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-black transition-all active:scale-95 flex items-center gap-3"
        >
          <i className="fas fa-plus-circle text-accent"></i> Deploy New Terminal
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {posUsers.map(u => (
          <div key={u.id} className="bg-white rounded-[3.5rem] border border-gray-100 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500 relative">
            <div className={`absolute top-10 right-10 flex items-center gap-2 ${u.status === 'Active' ? 'text-emerald-500' : 'text-red-500'}`}>
              <span className="text-[8px] font-black uppercase tracking-widest">{u.status}</span>
              <i className="fas fa-circle text-[8px] animate-pulse"></i>
            </div>
            
            <div className="p-10">
              <div className="flex items-center mb-10">
                <div className="w-16 h-16 rounded-[1.5rem] bg-gray-50 flex items-center justify-center text-primary text-3xl shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <i className="fas fa-cash-register"></i>
                </div>
                <div className="ml-6">
                  <h3 className="font-black text-gray-800 text-2xl tracking-tighter leading-none mb-1.5">{u.name}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{u.mobile_number}</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-10">
                 <div className="flex justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Daily Capacity</span>
                    <span className="text-xs font-black text-gray-800">50,000 BDT</span>
                 </div>
                 <div className="flex justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Auth Status</span>
                    <span className="text-xs font-black text-primary uppercase">Provisioned</span>
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                 <button 
                  onClick={() => setTransactionLimit(u.id)}
                  className="w-full py-4 bg-white border-2 border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:border-primary hover:text-primary transition-all"
                 >Adjust Limits</button>
                 
                 <div className="flex gap-3">
                    <button 
                      onClick={() => remoteLock(u.id, u.name || '')}
                      className="flex-1 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                    >
                      <i className="fas fa-lock mr-2"></i> Remote Lock
                    </button>
                    <button 
                      className="flex-1 py-4 bg-emerald-50 text-emerald-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                      onClick={() => {
                        const newStore = { ...store, users: store.users.map(user => user.id === u.id ? { ...user, status: 'Active' as any } : user) };
                        saveStoreData(newStore);
                        setStore(newStore);
                      }}
                    >
                      Activate
                    </button>
                 </div>
              </div>
            </div>
            
            <div className="bg-gray-50/50 p-6 border-t border-gray-100 text-center">
               <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Node UID: {u.id.slice(-12).toUpperCase()}</p>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-emerald-950/90 backdrop-blur-xl flex items-center justify-center z-[200] p-6 animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-[4rem] p-16 shadow-2xl animate-scaleIn relative overflow-hidden">
            <div className="mosque-pattern absolute inset-0 opacity-[0.03] pointer-events-none"></div>
            <h2 className="text-3xl font-black mb-12 text-gray-800 tracking-tighter uppercase text-center">Terminal Deployment</h2>
            <form onSubmit={handleAddPos} className="space-y-8 relative z-10">
              <div className="group">
                <label className="block text-[11px] font-black text-gray-400 uppercase mb-3 ml-6 tracking-widest group-focus-within:text-primary transition-colors">Operator Full Identity</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-[2.5rem] outline-none focus:border-primary transition-all font-bold text-gray-800 shadow-inner"
                  placeholder="e.g. Counter Admin 01"
                  value={newPos.name}
                  onChange={e => setNewPos({...newPos, name: e.target.value})}
                />
              </div>
              <div className="group">
                <label className="block text-[11px] font-black text-gray-400 uppercase mb-3 ml-6 tracking-widest group-focus-within:text-primary transition-colors">Username (Access UID)</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-[2.5rem] outline-none focus:border-primary transition-all font-bold text-gray-800 shadow-inner"
                  placeholder="e.g. pos_counter_01"
                  value={newPos.phone}
                  onChange={e => setNewPos({...newPos, phone: e.target.value})}
                />
              </div>
              <div className="group">
                <label className="block text-[11px] font-black text-gray-400 uppercase mb-3 ml-6 tracking-widest group-focus-within:text-primary transition-colors">Security PIN (4 Digits)</label>
                <input 
                  type="password" 
                  maxLength={4}
                  required 
                  className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-[2.5rem] outline-none focus:border-primary transition-all font-black text-4xl text-center tracking-[0.8em] shadow-inner"
                  placeholder="••••"
                  value={newPos.pin}
                  onChange={e => setNewPos({...newPos, pin: e.target.value})}
                />
              </div>
              <div className="flex gap-6 pt-10">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-7 bg-gray-50 text-gray-500 rounded-[2.5rem] font-black uppercase text-xs tracking-widest hover:bg-gray-100 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-7 bg-emerald-950 text-white rounded-[2.5rem] font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-black transition-all border-b-4 border-emerald-900">Provision Node</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPosControl;
