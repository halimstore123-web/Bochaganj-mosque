import React, { useState, useMemo } from 'react';
import { getStoreData, saveStoreData, createAuditLog, generatePdfReceipt, voidDonation, addDonation } from '../store';
import { Donation, ReceiptTemplate, DonationType, PaymentMethod } from '../types';

const AdminReceipts: React.FC = () => {
  const [store, setStore] = useState(getStoreData());
  const [search, setSearch] = useState('');
  const [selectedTxn, setSelectedTxn] = useState<Donation | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualData, setManualData] = useState({ mobile: '', amount: 0, type: DonationType.GENERAL });

  const foundTxns = useMemo(() => {
    return store.donations.filter(t => {
      const u = store.users.find(usr => usr.id === t.user_id);
      const term = search.toLowerCase();
      return (
        t.transactionUid.toLowerCase().includes(term) ||
        u?.name?.toLowerCase().includes(term) ||
        u?.mobile_number.includes(term)
      );
    });
  }, [store.donations, store.users, search]);

  const handleVoid = (id: string) => {
    const reason = prompt('SECURITY ALERT: Please enter the reason for voiding this entry in the official record:');
    if (!reason) return;
    
    if (voidDonation(id, 'admin_1', 'Super Admin', reason)) {
      setStore(getStoreData());
      setSelectedTxn(null);
      alert('Official Document successfully voided. Member spiritual asset adjusted.');
    }
  };

  const handleManualGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const user = store.users.find(u => u.mobile_number === manualData.mobile);
    if (!user) return alert('Member profile not found. Please register member first.');

    const donation = addDonation({
      userId: user.id,
      amount: manualData.amount,
      type: manualData.type,
      method: PaymentMethod.MANUAL,
      performerId: 'admin_1',
      performerType: 'ADMIN',
      status: 'Paid',
      receiptTemplate: ReceiptTemplate.CLASSIC
    });
    
    setStore(getStoreData());
    setShowManualModal(false);
    alert('Manual document successfully generated and archived.');
    generatePdfReceipt(donation, user, store.settings);
  };

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto animate-fadeIn min-h-screen font-sans bg-gray-50">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black text-gray-800 tracking-tighter uppercase leading-none">Receipt Central</h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-4 ml-1">Forensic Document Archive & Regulatory Controls</p>
        </div>
        <button onClick={() => setShowManualModal(true)} className="bg-emerald-950 text-white px-10 py-5 rounded-[2.5rem] font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-black transition-all flex items-center gap-4 active:scale-95 border-b-8 border-emerald-900">
          <i className="fas fa-plus-circle text-accent"></i> Create Manual Entry
        </button>
      </div>

      <div className="bg-white p-8 rounded-[4rem] shadow-sm border border-gray-100 mb-12 flex items-center group relative overflow-hidden">
        <div className="mosque-pattern absolute inset-0 opacity-[0.01] pointer-events-none"></div>
        <i className="fas fa-search ml-8 mr-8 text-gray-300 text-3xl group-focus-within:text-primary transition-colors"></i>
        <input 
          type="text" 
          placeholder="Search by Receipt UID, Donor Name, Mobile ID..." 
          className="flex-1 py-4 bg-transparent outline-none font-black text-3xl text-gray-800 placeholder:text-gray-200" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        <div className="h-12 w-px bg-gray-100 mx-8"></div>
        <div className="pr-8 text-[10px] font-black text-gray-300 uppercase tracking-widest">Archive Mode</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 bg-white rounded-[4.5rem] border border-gray-100 shadow-2xl overflow-hidden min-h-[650px] flex flex-col relative">
           <div className="mosque-pattern absolute inset-0 opacity-[0.01] pointer-events-none"></div>
           <div className="p-12 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center relative z-10">
              <span className="font-black text-[11px] uppercase text-gray-400 tracking-[0.4em]">Official Audit Ledger</span>
              <span className="bg-primary text-white px-4 py-1.5 rounded-xl text-[10px] font-black shadow-lg">{foundTxns.length} entries found</span>
           </div>
           <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white text-[9px] font-black text-gray-300 uppercase tracking-widest border-b border-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-12 py-8">Ledger Entry / Hash</th>
                    <th className="px-10 py-8">Donor Signature</th>
                    <th className="px-10 py-8 text-right">Value (৳)</th>
                    <th className="px-12 py-8 text-center">Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {foundTxns.map(t => (
                    <tr key={t.id} className={`hover:bg-primary/5 transition cursor-pointer group ${selectedTxn?.id === t.id ? 'bg-primary/5' : ''}`} onClick={() => setSelectedTxn(t)}>
                      <td className="px-12 py-10">
                        <p className="font-black text-gray-800 text-xs tracking-tighter mb-1 uppercase">${t.transactionUid}</p>
                        <p className="text-[10px] font-bold text-gray-300 uppercase tabular-nums">{new Date(t.created_at).toLocaleString()}</p>
                      </td>
                      <td className="px-10 py-10">
                        <p className="text-xl font-black text-gray-800 leading-none mb-2 group-hover:text-primary transition-colors">{store.users.find(u => u.id === t.user_id)?.name || 'Anonymous'}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">${t.donation_type}</p>
                      </td>
                      <td className="px-10 py-10 text-right">
                        <p className="font-black text-gray-800 text-3xl tabular-nums tracking-tighter leading-none">${t.amount.toLocaleString()}</p>
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mt-1">${t.payment_method}</p>
                      </td>
                      <td className="px-12 py-10 text-center">
                         <span className={`px-6 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest border ${t.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                           {t.status}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {foundTxns.length === 0 && (
                <div className="py-60 text-center flex flex-col items-center opacity-10">
                   <i className="fas fa-file-invoice text-[15rem] mb-12"></i>
                   <p className="text-4xl font-black uppercase tracking-[0.5em]">Ledger Empty</p>
                </div>
              )}
           </div>
        </div>

        <div className="lg:col-span-4">
          {selectedTxn ? (
            <div className="bg-white p-12 rounded-[5rem] border border-gray-100 shadow-2xl animate-scaleIn sticky top-24 overflow-hidden relative border-t-8 border-primary">
              <div className="mosque-pattern absolute inset-0 opacity-[0.03] pointer-events-none"></div>
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.5em] mb-12 text-center relative z-10">Compliance Node</h3>
              <div className="space-y-8 relative z-10">
                <div className="bg-gray-50 p-10 rounded-[3.5rem] border border-gray-100 mb-10 shadow-inner">
                   <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">Internal UID Mapping</p>
                   <p className="text-xs font-bold text-gray-500 break-all leading-relaxed">${selectedTxn.id}</p>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <button onClick={() => {
                    const u = store.users.find(usr => usr.id === selectedTxn.user_id);
                    if(u) generatePdfReceipt(selectedTxn, u, store.settings);
                  }} className="w-full flex items-center justify-between p-10 bg-emerald-50 hover:bg-emerald-100 rounded-[3rem] transition-all group border border-emerald-100 shadow-sm active:scale-95">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-white shadow-xl flex items-center justify-center text-emerald-600 text-3xl group-hover:scale-110 transition-transform"><i className="fas fa-file-pdf"></i></div>
                        <div className="text-left">
                           <p className="text-[12px] font-black uppercase tracking-widest text-emerald-950">Reprint Receipt</p>
                           <p className="text-[10px] font-bold text-emerald-600/60 uppercase">Verified English PDF</p>
                        </div>
                     </div>
                     <i className="fas fa-chevron-right text-emerald-300 group-hover:translate-x-2 transition-transform"></i>
                  </button>

                  {selectedTxn.status === 'Paid' && (
                    <button onClick={() => handleVoid(selectedTxn.id)} className="w-full flex items-center justify-between p-10 bg-red-50 hover:bg-red-100 rounded-[3rem] transition-all group border border-red-100 shadow-sm active:scale-95">
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 rounded-[1.5rem] bg-white shadow-xl flex items-center justify-center text-red-600 text-3xl group-hover:scale-110 transition-transform"><i className="fas fa-ban"></i></div>
                         <div className="text-left">
                            <p className="text-[12px] font-black uppercase tracking-widest text-red-950">Void / Revoke</p>
                            <p className="text-[10px] font-bold text-red-600/60 uppercase">Deduct balance & cancel</p>
                         </div>
                      </div>
                      <i className="fas fa-chevron-right text-red-300 group-hover:translate-x-2 transition-transform"></i>
                    </button>
                  )}
                </div>

                {selectedTxn.status === 'Rejected' && (
                  <div className="p-12 bg-red-950 rounded-[4rem] border border-red-900 shadow-2xl mt-12">
                    <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.5em] mb-6 text-center">VOID AUDIT TRAIL</p>
                    <p className="text-lg font-bold text-white italic text-center leading-relaxed">"${selectedTxn.void_reason || selectedTxn.rejection_reason || 'Administrative Override Active'}"</p>
                    <div className="h-px bg-white/10 my-8 w-20 mx-auto"></div>
                    <p className="text-[9px] font-black text-white/30 text-center uppercase tracking-widest">Void Authorized: ${new Date(selectedTxn.voided_at || selectedTxn.updated_at).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-4 border-dashed border-gray-100 rounded-[5rem] p-32 text-center sticky top-24 select-none opacity-40 grayscale flex flex-col items-center">
              <i className="fas fa-fingerprint text-9xl text-gray-200 mb-10"></i>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] leading-relaxed">System awaiting credential selection or search initiation</p>
            </div>
          )}
        </div>
      </div>

      {/* Manual Creation Protocol Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-emerald-950/95 backdrop-blur-3xl flex items-center justify-center z-[200] p-6 animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-[5rem] p-20 shadow-2xl animate-scaleIn relative overflow-hidden border-b-8 border-primary">
            <div className="mosque-pattern absolute inset-0 opacity-[0.03] pointer-events-none"></div>
            <h2 className="text-4xl font-black mb-16 text-gray-800 tracking-tighter uppercase text-center relative z-10 leading-none">Manual Receipt Generation</h2>
            <form onSubmit={handleManualGenerate} className="space-y-12 relative z-10">
              <div className="group">
                <label className="block text-[11px] font-black text-gray-400 uppercase mb-4 ml-10 tracking-widest group-focus-within:text-primary transition-colors">Recipient Mobile ID</label>
                <input 
                  required 
                  className="w-full px-12 py-8 bg-gray-50 border-2 border-gray-100 rounded-[3.5rem] font-black text-2xl focus:border-primary outline-none transition-all shadow-inner tabular-nums" 
                  placeholder="01XXXXXXXXX"
                  value={manualData.mobile} 
                  onChange={e => setManualData({...manualData, mobile: e.target.value})} 
                />
              </div>
              <div className="group">
                <label className="block text-[11px] font-black text-gray-400 uppercase mb-4 ml-10 tracking-widest group-focus-within:text-primary transition-colors">Gift Value (৳)</label>
                <input 
                  type="number" 
                  required 
                  className="w-full px-12 py-10 bg-gray-50 border-2 border-gray-100 rounded-[4rem] font-black text-7xl text-primary focus:border-primary outline-none shadow-inner tabular-nums text-center" 
                  placeholder="000"
                  value={manualData.amount || ''} 
                  onChange={e => setManualData({...manualData, amount: Number(e.target.value)})} 
                />
              </div>
              <div className="group">
                <label className="block text-[11px] font-black text-gray-400 uppercase mb-4 ml-10 tracking-widest group-focus-within:text-primary transition-colors">Fund Head Allocation</label>
                <select className="w-full px-12 py-8 bg-gray-50 border-2 border-gray-100 rounded-[3.5rem] font-black text-[12px] uppercase appearance-none focus:border-primary focus:ring-0 outline-none shadow-inner cursor-pointer" value={manualData.type} onChange={e => setManualData({...manualData, type: e.target.value as DonationType})}>
                  {Object.values(DonationType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex gap-8 pt-10">
                <button type="button" onClick={() => setShowManualModal(false)} className="flex-1 py-10 bg-gray-100 text-gray-500 rounded-[3.5rem] font-black uppercase text-[11px] tracking-widest shadow-inner hover:bg-gray-200 transition-all">Discard</button>
                <button type="submit" className="flex-1 py-10 bg-emerald-950 text-white rounded-[3.5rem] font-black uppercase text-[11px] tracking-widest shadow-2xl hover:bg-black transition-all border-b-8 border-emerald-900 active:translate-y-1 active:border-b-0">Commit & Generate</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReceipts;