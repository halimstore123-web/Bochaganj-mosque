
import React, { useState, useMemo } from 'react';
import { getStoreData, approveDonation, rejectDonation, exportToCsv, generatePdfReceipt } from '../store';
import { Donation } from '../types';

const AdminDonations: React.FC = () => {
  const [store, setStore] = useState(getStoreData());
  const [filter, setFilter] = useState<Donation['status'] | 'All'>('Pending');
  const [search, setSearch] = useState('');
  const [selectedTxn, setSelectedTxn] = useState<Donation | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const filteredTransactions = useMemo(() => {
    return store.donations.filter(t => {
      const matchesFilter = filter === 'All' ? true : t.status === filter;
      const donor = store.users.find(u => u.id === t.user_id);
      const matchesSearch = t.transactionUid.toLowerCase().includes(search.toLowerCase()) || 
                           (donor?.name?.toLowerCase().includes(search.toLowerCase())) ||
                           (donor?.mobile_number.includes(search));
      return matchesFilter && matchesSearch;
    });
  }, [store.donations, filter, search, store.users]);

  const handleApprove = (id: string) => {
    if (approveDonation(id, 'admin_1', 'Super Admin')) {
      setStore(getStoreData());
      setSelectedTxn(null);
      alert('Payment Verified & Credited Successfully.');
    }
  };

  const handleReject = (id: string) => {
    if (!rejectionReason) return alert('Mandatory Rejection Context Required.');
    if (rejectDonation(id, 'admin_1', 'Super Admin', rejectionReason)) {
      setStore(getStoreData());
      setSelectedTxn(null);
      setRejectionReason('');
      alert('Verification Denied.');
    }
  };

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto animate-fadeIn font-sans min-h-screen bg-gray-50 pb-32">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
        <div>
          <h1 className="text-4xl font-black text-gray-800 tracking-tighter uppercase leading-none">Verification Queue</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-3">Monetary Compliance Terminal</p>
        </div>
        <div className="flex bg-white p-2 rounded-[2rem] border border-gray-100 shadow-sm">
           {(['Pending', 'Paid', 'Rejected', 'All'] as const).map(f => (
             <button key={f} onClick={() => setFilter(f)} className={`px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-primary text-white shadow-xl scale-105' : 'text-gray-400 hover:text-gray-600'}`}>
               {f === 'Pending' ? `Queue (${store.donations.filter(d => d.status === 'Pending').length})` : f}
             </button>
           ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center group">
              <i className="fas fa-search ml-6 mr-4 text-gray-300 group-focus-within:text-primary transition-colors text-xl"></i>
              <input type="text" placeholder="Search by UID, Donor Name or Mobile ID..." className="w-full py-4 bg-transparent outline-none font-black text-lg text-gray-800" value={search} onChange={e => setSearch(e.target.value)} />
           </div>

           <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl overflow-hidden min-h-[600px] relative">
              <div className="overflow-x-auto relative z-10">
                 <table className="w-full text-left">
                    <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                       <tr>
                          <th className="px-10 py-8">Timestamp</th>
                          <th className="px-10 py-8">Member Profile</th>
                          <th className="px-10 py-8 text-right">Amount</th>
                          <th className="px-10 py-8 text-center">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {filteredTransactions.map(t => {
                         const donor = store.users.find(u => u.id === t.user_id);
                         return (
                           <tr key={t.id} onClick={() => setSelectedTxn(t)} className={`hover:bg-primary/5 transition-all cursor-pointer group ${selectedTxn?.id === t.id ? 'bg-primary/5' : ''}`}>
                              <td className="px-10 py-8">
                                 <p className="text-[10px] font-black text-gray-800 tabular-nums">{new Date(t.created_at).toLocaleDateString()}</p>
                                 <p className="text-[9px] font-bold text-gray-300 uppercase mt-1">{new Date(t.created_at).toLocaleTimeString()}</p>
                              </td>
                              <td className="px-10 py-8">
                                 <p className="font-black text-gray-800 text-lg leading-tight group-hover:text-primary transition-colors">{donor?.name || 'Anonymous'}</p>
                                 <p className="text-[10px] font-bold text-gray-400 tracking-tighter uppercase mt-1">{t.transactionUid}</p>
                              </td>
                              <td className="px-10 py-8 text-right">
                                 <p className="text-2xl font-black text-gray-800 tracking-tighter tabular-nums">{t.amount}৳</p>
                                 <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{t.payment_method}</p>
                              </td>
                              <td className="px-10 py-8 text-center">
                                 <div className={`inline-flex px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${t.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : t.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                    {t.status}
                                 </div>
                              </td>
                           </tr>
                         );
                       })}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        <div className="lg:col-span-4">
           {selectedTxn ? (
             <div className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-2xl animate-scaleIn sticky top-24 overflow-hidden relative border-t-8 border-primary">
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-10 border-b border-gray-50 pb-8">Audit Summary</h3>
                <div className="space-y-8 relative z-10">
                   <div className="bg-gray-50 p-8 rounded-[3rem] border border-gray-100 shadow-inner">
                      <div className="flex justify-between mb-4">
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Receipt ID</span>
                         <span className="text-[10px] font-black text-primary">{selectedTxn.transactionUid}</span>
                      </div>
                      <h4 className="text-5xl font-black text-gray-800 tracking-tighter tabular-nums mb-6">{selectedTxn.amount}৳</h4>
                      <div className="flex flex-wrap gap-2">
                         <span className="bg-white px-4 py-1.5 rounded-xl border border-gray-100 text-[9px] font-black text-gray-500 uppercase tracking-widest">{selectedTxn.donation_type}</span>
                         <span className="bg-white px-4 py-1.5 rounded-xl border border-gray-100 text-[9px] font-black text-gray-500 uppercase tracking-widest">{selectedTxn.payment_method}</span>
                      </div>
                   </div>

                   {selectedTxn.status === 'Pending' ? (
                     <div className="space-y-6 pt-6">
                        <button onClick={() => handleApprove(selectedTxn.id)} className="w-full py-6 bg-primary text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-secondary transition-all active:scale-95 flex items-center justify-center gap-3">
                           <i className="fas fa-check-circle text-lg"></i> Approve Payment
                        </button>
                        <div className="pt-6 border-t border-gray-100">
                          <input className="w-full px-6 py-4 bg-red-50 border border-red-100 rounded-2xl outline-none mb-3 font-bold text-xs" placeholder="Rejection context..." value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} />
                          <button onClick={() => handleReject(selectedTxn.id)} className="w-full py-5 bg-white text-red-600 border-2 border-red-100 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95">Deny Transfer</button>
                        </div>
                     </div>
                   ) : (
                     <div className="pt-8 text-center">
                        <div className={`p-8 rounded-[2.5rem] shadow-inner mb-8 ${selectedTxn.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                           <p className="text-xs font-black uppercase tracking-widest">Entry Finalized: {selectedTxn.status}</p>
                           <p className="text-[10px] font-bold mt-2 opacity-60">Verified by: {selectedTxn.verified_by || 'Admin Core'}</p>
                        </div>
                        {selectedTxn.status === 'Paid' && (
                           <button onClick={() => {
                             const u = store.users.find(usr => usr.id === selectedTxn.user_id);
                             if(u) generatePdfReceipt(selectedTxn, u, store.settings);
                           }} className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3">
                              <i className="fas fa-print"></i> Generate Receipt
                           </button>
                        )}
                     </div>
                   )}
                </div>
             </div>
           ) : (
             <div className="bg-gray-50 border-4 border-dashed border-gray-100 rounded-[4rem] p-24 text-center sticky top-24 select-none opacity-40">
                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] leading-relaxed">Select an audit entry to process</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AdminDonations;
