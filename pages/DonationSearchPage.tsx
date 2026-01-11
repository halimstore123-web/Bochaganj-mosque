
import React, { useState, useMemo } from 'react';
import { getStoreData } from '../store';
import { Link } from 'react-router-dom';

const DonationSearchPage: React.FC = () => {
  const [verifyId, setVerifyId] = useState('');
  const [result, setResult] = useState<any>(null);
  const store = getStoreData();

  const handleSearch = () => {
    if (!verifyId) return;
    const user = store.users.find(u => u.mobile_number === verifyId || u.token_id === verifyId);
    if (user) {
      const txns = store.donations.filter(t => t.user_id === user.id && t.status === 'Paid');
      const total = txns.reduce((s, t) => s + t.amount, 0);
      setResult({ user, total, txns });
    } else {
      setResult('not_found');
    }
  };

  return (
    <div className="animate-fadeIn font-sans bg-gray-50 min-h-screen">
      <section className="bg-primary py-24 px-6 text-center text-white relative overflow-hidden mosque-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">হাদিয়ার তথ্য অনুসন্ধান</h1>
          <p className="text-lg text-white/70">আপনার মোবাইল নম্বর বা টোকেন আইডি ব্যবহার করে দান ও হাদিয়ার তথ্য খুঁজে নিন</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-20 pb-24">
        <div className="bg-white p-10 md:p-16 rounded-[3.5rem] shadow-2xl border border-gray-100 mb-10">
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <input 
              type="text" 
              placeholder="মোবাইল নম্বর / টোকেন আইডি লিখুন..."
              className="flex-1 px-8 py-6 rounded-[2rem] bg-gray-50 border-2 border-transparent focus:border-primary outline-none font-black text-2xl transition-all shadow-inner"
              value={verifyId}
              onChange={e => setVerifyId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="bg-primary text-white px-12 py-6 rounded-[2rem] font-black text-sm uppercase shadow-2xl hover:bg-secondary transition-all active:scale-95">
              তথ্য খুঁজুন
            </button>
          </div>

          {result === 'not_found' && (
            <div className="p-12 text-center bg-red-50 rounded-[3rem] border border-red-100 animate-slideDown">
               <i className="fas fa-user-times text-5xl text-red-300 mb-6"></i>
               <h3 className="text-2xl font-black text-red-600 mb-2">তথ্য পাওয়া যায়নি!</h3>
               <p className="text-gray-500">অনুগ্রহ করে সঠিক মোবাইল নম্বর বা টোকেন আইডি প্রদান করুন অথবা মসজিদ অফিসে যোগাযোগ করুন।</p>
            </div>
          )}

          {result && result !== 'not_found' && (
            <div className="animate-slideDown space-y-10">
              <div className="bg-primary p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                <div className="mosque-pattern absolute inset-0 opacity-10"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
                  <div>
                    <h2 className="text-4xl font-black tracking-tighter mb-2">{result.user.name}</h2>
                    <p className="text-accent font-black text-xs uppercase tracking-widest">টোকেন আইডি: {result.user.token_id}</p>
                  </div>
                  <div className="bg-white/10 p-8 rounded-[2.5rem] border border-white/10 min-w-[240px]">
                    <p className="text-[10px] font-black uppercase text-white/50 tracking-widest mb-2">মোট হাদিয়া সংগ্রহ</p>
                    <p className="text-5xl font-black">{result.total.toLocaleString()}৳</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-[3rem] overflow-hidden shadow-sm">
                <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                   <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">সাম্প্রতিক লেনদেনসমূহ</h3>
                   <Link to="/login" className="text-[10px] font-black text-primary uppercase border-b-2 border-primary/20 hover:border-primary transition-all pb-1">পূর্ণ ইতিহাস দেখুন</Link>
                </div>
                <div className="divide-y divide-gray-50">
                  {result.txns.slice(0, 5).map((t: any) => (
                    <div key={t.id} className="p-8 flex justify-between items-center hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center text-lg">
                           <i className="fas fa-receipt"></i>
                        </div>
                        <div>
                          <p className="font-black text-gray-800 text-lg">{t.donation_type}</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{new Date(t.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className="text-2xl font-black text-primary tracking-tighter">{t.amount}৳</p>
                    </div>
                  ))}
                  {result.txns.length === 0 && (
                    <div className="p-20 text-center opacity-20">
                       <i className="fas fa-history text-5xl mb-4"></i>
                       <p className="font-black uppercase text-xs">কোন রেকর্ড পাওয়া যায়নি</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationSearchPage;
