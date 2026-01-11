
import React, { useState, useMemo } from 'react';
import { getStoreData, saveStoreData, createAuditLog, exportToCsv } from '../store';
import { User, UserType, UserRole, UserTag } from '../types';

const AdminUsers: React.FC = () => {
  const [store, setStore] = useState(getStoreData());
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    mobile_number: '',
    assigned_monthly_amount: 500,
    user_type: UserType.REGULAR,
    role: UserRole.USER,
    status: 'Active' as 'Active' | 'Blocked'
  });

  const filteredUsers = useMemo(() => 
    store.users.filter(u => 
      u.mobile_number.includes(searchTerm) || 
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [searchTerm, store.users]
  );

  const handleExport = () => {
    const data = filteredUsers.map(u => ({
      'Name': u.name,
      'Phone': u.mobile_number,
      'Role': u.role,
      'Status': u.status,
      'Lifetime Contributed': u.total_contributed,
      'Wallet Balance': u.balance
    }));
    exportToCsv(data, 'Mosque_User_Directory');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = getStoreData();
    const now = new Date().toISOString();

    if (editingUser) {
      data.users = data.users.map(u => u.id === editingUser.id ? { ...u, ...formData, updated_at: now } : u);
      createAuditLog('User_Edit', 'admin_1', 'ADMIN', `Updated profile: ${formData.name}`, editingUser.id);
    } else {
      const newUser: User = {
        id: `u_${Date.now()}`,
        token_id: formData.mobile_number,
        ...formData,
        status: 'Active' as any,
        balance: 0,
        total_contributed: 0,
        auto_invoice_enabled: true,
        created_at: now,
        updated_at: now,
        tags: [UserTag.REGULAR]
      };
      data.users.push(newUser);
      createAuditLog('User_Edit', 'admin_1', 'ADMIN', `Registered member: ${formData.name}`, newUser.id);
    }

    saveStoreData(data);
    setStore(data);
    setShowAddModal(false);
    setEditingUser(null);
  };

  const handleToggleBlock = (user: User) => {
    const newStatus = user.status === 'Blocked' ? 'Active' : 'Blocked';
    const data = getStoreData();
    data.users = data.users.map(u => u.id === user.id ? { ...u, status: newStatus as any } : u);
    saveStoreData(data);
    setStore(data);
    createAuditLog('Security', 'admin_1', 'ADMIN', `${newStatus} user: ${user.name}`, user.id);
  };

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto animate-fadeIn bg-gray-50 min-h-screen font-sans pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div>
          <h1 className="text-4xl font-black text-gray-800 tracking-tighter uppercase leading-none">Member Governance</h1>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.4em] mt-4">Identity Access Management Console</p>
        </div>
        <div className="flex gap-4">
          <button onClick={handleExport} className="bg-white border-2 border-gray-100 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-emerald-900 hover:shadow-lg transition-all flex items-center gap-3">
            <i className="fas fa-file-excel text-emerald-600"></i> Export List
          </button>
          <button onClick={() => setShowAddModal(true)} className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-secondary transition-all active:scale-95 border-b-4 border-emerald-950">
            <i className="fas fa-user-plus mr-4 text-accent"></i> Add Member
          </button>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[4.5rem] shadow-sm border border-gray-100 mb-16 flex items-center gap-8 relative overflow-hidden">
        <div className="mosque-pattern absolute inset-0 opacity-[0.01]"></div>
        <i className="fas fa-search ml-10 text-gray-300 text-2xl"></i>
        <input 
          type="text" 
          placeholder="Search by name or mobile identifier..." 
          className="w-full pr-12 py-7 bg-transparent border-0 outline-none font-black text-2xl text-gray-800 placeholder:text-gray-200" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      <div className="bg-white rounded-[5rem] border border-gray-100 shadow-2xl overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-gray-100">
              <tr>
                <th className="px-14 py-12">Member Identity</th>
                <th className="px-10 py-12 text-center">Spiritual Asset</th>
                <th className="px-10 py-12 text-center">Commitment</th>
                <th className="px-10 py-12 text-center">Status</th>
                <th className="px-14 py-12 text-right">Command</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-14 py-12">
                    <p className="font-black text-gray-800 text-2xl leading-none mb-3">{u.name}</p>
                    <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">{u.mobile_number} • {u.role}</p>
                  </td>
                  <td className="px-10 py-12 text-center">
                    <p className="font-black text-emerald-950 text-3xl tabular-nums leading-none mb-2">{u.total_contributed.toLocaleString()} ৳</p>
                    <span className="text-[9px] font-black uppercase text-gray-300 tracking-widest">Lifetime Assets</span>
                  </td>
                  <td className="px-10 py-12 text-center">
                    <p className="font-black text-gray-800 text-2xl tabular-nums leading-none mb-2">{u.assigned_monthly_amount} ৳</p>
                    <span className="text-[9px] font-black uppercase text-gray-300 tracking-widest">Monthly Goal</span>
                  </td>
                  <td className="px-10 py-12 text-center">
                    <span className={`inline-block px-6 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest border-2 ${u.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-14 py-12 text-right">
                    <div className="flex justify-end gap-5">
                       <button onClick={() => { setEditingUser(u); setFormData({name: u.name || '', mobile_number: u.mobile_number, assigned_monthly_amount: u.assigned_monthly_amount, user_type: u.user_type, role: u.role, status: u.status as any}); setShowAddModal(true); }} className="w-14 h-14 bg-gray-50 text-gray-400 hover:bg-primary hover:text-white rounded-2xl flex items-center justify-center transition-all shadow-xl">
                          <i className="fas fa-pen"></i>
                       </button>
                       <button onClick={() => handleToggleBlock(u)} className={`w-14 h-14 ${u.status === 'Blocked' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} hover:bg-black hover:text-white rounded-2xl flex items-center justify-center transition-all shadow-xl`}>
                          <i className={`fas ${u.status === 'Blocked' ? 'fa-unlock' : 'fa-user-slash'}`}></i>
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-emerald-950/90 backdrop-blur-xl flex items-center justify-center z-[200] p-6 animate-fadeIn">
          <div className="bg-white w-full max-w-4xl rounded-[5rem] p-20 shadow-2xl animate-scaleIn relative overflow-hidden flex flex-col max-h-[90vh]">
            <h2 className="text-4xl font-black mb-12 text-gray-800 tracking-tighter uppercase leading-none text-center">
              {editingUser ? 'Update Profile' : 'New Member Registration'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-10 overflow-y-auto px-4 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                   <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-6">Full Name / Identity</label>
                   <input required className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-[2rem] outline-none focus:border-primary font-bold shadow-inner" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-4">
                   <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-6">Mobile ID</label>
                   <input required className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-[2rem] outline-none focus:border-primary font-bold shadow-inner" value={formData.mobile_number} onChange={e => setFormData({...formData, mobile_number: e.target.value})} />
                </div>
                <div className="space-y-4">
                   <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-6">Monthly Commitment (৳)</label>
                   <input type="number" required className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-[2rem] outline-none focus:border-primary font-black text-xl shadow-inner" value={formData.assigned_monthly_amount} onChange={e => setFormData({...formData, assigned_monthly_amount: Number(e.target.value)})} />
                </div>
                <div className="space-y-4">
                   <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-6">Access Role</label>
                   <select className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-[2rem] font-black text-[11px] uppercase" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})}>
                      {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
                   </select>
                </div>
              </div>
              <div className="flex gap-8 pt-10">
                <button type="button" onClick={() => { setShowAddModal(false); setEditingUser(null); }} className="flex-1 py-8 bg-gray-50 text-gray-400 rounded-[2.5rem] font-black uppercase text-[10px] tracking-widest">Discard changes</button>
                <button type="submit" className="flex-1 py-8 bg-primary text-white rounded-[2.5rem] font-black uppercase text-[10px] tracking-widest shadow-2xl border-b-8 border-emerald-950 active:translate-y-1">Commit to Ledger</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
