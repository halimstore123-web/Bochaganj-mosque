
import React, { useMemo, useState } from 'react';
import { User, Donation, DonationType } from '../types';
import { getStoreData, saveStoreData, generatePdfReceipt, exportToCsv } from '../store';

interface UserDashboardProps {
  user: User;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  const store = getStoreData();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'receipts'>('overview');

  const myTransactions = useMemo(() => 
    store.donations.filter(t => t.user_id === user.id).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [store.donations, user.id]
  );

  const stats = useMemo(() => {
    const totalDonated = myTransactions.filter(t => t.status === 'Paid').reduce((sum, t) => sum + t.amount, 0);
    const pendingAmount = myTransactions.filter(t => t.status === 'Pending').reduce((sum, t) => sum + t.amount, 0);
    return { totalDonated, pendingAmount, receiptCount: myTransactions.filter(t => t.status === 'Paid').length };
  }, [myTransactions]);

  const hasPendingDues = user.balance < user.assigned_monthly_amount;

  const handleExportHistory = () => {
    const data = myTransactions.map(t => ({
      Date: new Date(t.created_at).toLocaleDateString(),
      Type: t.donation_type,
      Amount: t.amount,
      Status: t.status,
      Method: t.payment_method,
      ReceiptID: t.transactionUid
    }));
    exportToCsv(data, `DonationHistory_${user.mobile_number}`);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] pb-24 md:pb-8 animate-fadeIn font-sans">
      <div className="bg-primary pt-16 pb-32 px-6 relative overflow-hidden mosque-pattern no-print">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary"></div>
        <div className="max-w-5xl mx-auto flex justify-between items-center relative z-10">
          <div>
            <h1 className="text-white text-5xl font-black tracking-tighter uppercase leading-none">আসসালামু আলাইকুম</h1>
            <p className="text-accent font-black text-xs uppercase tracking-[0.4em] mt-6 leading-none">{user.name} • ভেরিফাইড সদস্য</p>
          </div>
          <div className="w-24 h-24 bg-white/10 rounded-[2.5rem] flex items-center justify-center text-white border-2 border-white/20 backdrop-blur-xl relative shadow-2xl">
             <i className="fas fa-user-circle text-4xl"></i>
             <div className={`absolute -bottom-2 -right-2 w-10 h-10 ${hasPendingDues ? 'bg-amber-500' : 'bg-emerald-500'} rounded-2xl border-4 border-primary flex items-center justify-center shadow-xl`}>
                <i className={`fas ${hasPendingDues ? 'fa-exclamation-triangle' : 'fa-check'} text-xs text-white`}></i>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-20">
        {hasPendingDues && (
          <div className="bg-amber-50 border-2 border-amber-200 p-8 rounded-[3rem] mb-12 animate-slideDown flex justify-between items-center">
             <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-amber-200 text-amber-900 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                   <i className="fas fa-hand-holding-dollar"></i>
                </div>
                <div>
                   <h4 className="font-black text-amber-900 text-lg leading-tight mb-1">বকেয়া মাসিক হাদিয়া</h4>
                   <p className="text-[10px] font-bold text-amber-700/60 uppercase tracking-widest">আপনার এই মাসের হাদিয়া বকেয়া রয়েছে। দ্রুত পরিশোধ করুন।</p>
                </div>
             </div>
             <a href="#/donate" className="bg-amber-950 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">পরিশোধ করুন</a>
          </div>
        )}

        <div className="bg-white rounded-[4rem] shadow-2xl p-16 mb-12 border border-gray-100 flex flex-col lg:flex-row gap-12 lg:items-center overflow-hidden no-print relative">
           <div className="mosque-pattern absolute inset-0 opacity-[0.01] pointer-events-none"></div>
           <div className="flex-1 relative z-10">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.5em] mb-6">আপনার মোট হাদিয়া সংগ্রহ</p>
              <h2 className="text-8xl font-black text-primary tracking-tighter tabular-nums leading-none">{stats.totalDonated.toLocaleString()}<span className="text-2xl ml-2 opacity-30">৳</span></h2>
           </div>
           <div className="flex flex-wrap gap-4 relative z-10">
             <button onClick={handleExportHistory} className="bg-emerald-50 text-emerald-700 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-100 transition-all border-2 border-emerald-100/50 shadow-sm active:scale-95">ডাউনলোড এক্সেল রিপোর্ট</button>
             <button onClick={() => window.print()} className="bg-emerald-950 text-white px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-2xl active:scale-95 border-b-4 border-emerald-900">সেটেলমেন্ট লেজার প্রিন্ট</button>
           </div>
        </div>

        <div className="flex bg-gray-200/40 p-2 rounded-[3rem] mb-16 overflow-x-auto whitespace-nowrap scrollbar-hide no-print backdrop-blur-sm border border-white">
          {[
            { id: 'overview', label: 'সারাংশ', icon: 'fa-chart-pie' },
            { id: 'history', label: 'লেনদেনের খাতা', icon: 'fa-history' },
            { id: 'receipts', label: 'রশিদ ভল্ট', icon: 'fa-print' }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`flex-1 py-6 px-12 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all relative flex items-center justify-center gap-4 ${activeTab === tab.id ? 'bg-white text-primary shadow-2xl scale-105 z-10 border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <i className={`fas ${tab.icon} opacity-40`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'receipts' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-fadeIn no-print">
              {myTransactions.filter(t => t.status === 'Paid').map(t => (
                <div key={t.id} className="bg-white p-14 rounded-[4.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                  <div className="mosque-pattern absolute inset-0 opacity-[0.02] pointer-events-none"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-12">
                        <div className="w-16 h-16 bg-primary/5 text-primary rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500">
                           <i className="fas fa-file-invoice"></i>
                        </div>
                        <div className="text-right">
                           <p className="text-[11px] font-black text-gray-800 tracking-tighter leading-none mb-2 uppercase tracking-widest">{t.transactionUid}</p>
                           <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest tabular-nums">{new Date(t.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <h4 className="text-6xl font-black text-gray-800 mb-2 tracking-tighter tabular-nums leading-none">{t.amount.toLocaleString()}</h4>
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-16 flex items-center gap-3">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-lg shadow-emerald-200"></span>
                      {t.donation_type} Verified Hadiya
                    </p>
                    <button onClick={() => generatePdfReceipt(t, user, store.settings)} className="w-full py-7 bg-emerald-950 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.3em] hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-4 active:scale-95 border-b-4 border-emerald-900">
                      <i className="fas fa-download text-accent"></i> Official English PDF
                    </button>
                  </div>
                </div>
              ))}
              {myTransactions.filter(t => t.status === 'Paid').length === 0 && (
                 <div className="md:col-span-2 py-60 text-center flex flex-col items-center opacity-10 grayscale select-none">
                    <i className="fas fa-receipt text-[15rem] mb-12"></i>
                    <p className="text-4xl font-black uppercase tracking-[0.5em]">রশিদ ভল্ট খালি</p>
                 </div>
              )}
           </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-[4.5rem] shadow-2xl border border-gray-100 overflow-hidden no-print">
            <div className="p-12 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
               <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">ব্যক্তিগত লেনদেন ইতিহাস</h3>
               <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{myTransactions.length} রেকর্ড পাওয়া গেছে</span>
            </div>
            <div className="divide-y divide-gray-50">
              {myTransactions.map(t => (
                <div key={t.id} className="p-12 flex flex-col sm:flex-row items-center justify-between hover:bg-gray-50/80 transition-all border-l-[12px] border-l-transparent hover:border-l-primary group">
                  <div className="flex items-center gap-12">
                     <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-4xl transition-all shadow-inner relative ${t.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        <i className={`fas ${t.status === 'Paid' ? 'fa-check-circle' : 'fa-clock'}`}></i>
                        {t.status === 'Pending' && <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full animate-ping"></span>}
                     </div>
                     <div>
                        <h4 className="font-black text-gray-800 text-3xl tracking-tighter leading-none mb-3">{t.donation_type} হাদিয়া</h4>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                           <span><i className="far fa-calendar-alt"></i> {new Date(t.created_at).toLocaleDateString()}</span>
                           <span className="opacity-20">•</span>
                           <span><i className="fas fa-credit-card"></i> {t.payment_method}</span>
                        </p>
                     </div>
                  </div>
                  <div className="text-right mt-10 sm:mt-0">
                    <h4 className={`text-5xl font-black tracking-tighter mb-2 tabular-nums leading-none ${t.status === 'Paid' ? 'text-primary' : 'text-amber-600'}`}>{t.amount.toLocaleString()}<span className="text-xl opacity-30">৳</span></h4>
                    <span className={`text-[9px] font-black uppercase px-6 py-2 rounded-xl border-2 shadow-sm ${t.status === 'Paid' ? 'text-emerald-600 bg-white border-emerald-100' : 'text-amber-600 bg-white border-amber-100'}`}>{t.status} Transaction</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
           <div className="animate-fadeIn space-y-12 no-print pb-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="bg-white p-14 rounded-[5rem] shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                    <div className="mosque-pattern absolute inset-0 opacity-[0.01]"></div>
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.5em] mb-12 text-center">Spiritual Commitment Node</p>
                    <div className="flex justify-between items-end border-b border-gray-50 pb-10 mb-10">
                       <h3 className="text-3xl font-black text-gray-800 tracking-tighter">মাসিক প্রতিশ্রুতি</h3>
                       <p className="text-6xl font-black text-primary tracking-tighter tabular-nums leading-none">{user.assigned_monthly_amount}<span className="text-2xl opacity-20 ml-1">৳</span></p>
                    </div>
                    <p className="text-[10px] font-bold text-gray-300 text-center uppercase tracking-widest leading-relaxed">System Auto-Invoicing is currently {user.auto_invoice_enabled ? 'ENABLED' : 'OFFLINE'}</p>
                 </div>
                 <div className="bg-emerald-950 p-14 rounded-[5rem] shadow-2xl text-white relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                    <div className="mosque-pattern absolute inset-0 opacity-10"></div>
                    <p className="text-[11px] font-black text-accent/60 uppercase tracking-[0.5em] mb-12 text-center">Spiritual Asset base</p>
                    <div className="flex justify-between items-end border-b border-white/5 pb-10 mb-10">
                       <h3 className="text-3xl font-black tracking-tighter">সারাজীবনের মোট দান</h3>
                       <p className="text-6xl font-black text-accent tracking-tighter tabular-nums leading-none">{user.total_contributed.toLocaleString()}<span className="text-2xl opacity-20 ml-1">৳</span></p>
                    </div>
                    <p className="text-[10px] font-bold text-white/30 text-center uppercase tracking-widest leading-relaxed">Verified Member Identifier: BMMS-USR-{user.token_id.toUpperCase()}</p>
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
