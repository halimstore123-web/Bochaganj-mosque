
import React, { useState } from 'react';
import { User, DonationType, UserRole, UserType, PaymentMethod } from '../types';
import { getStoreData, saveStoreData, addDonation } from '../store';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface DonationPageProps {
  user: User | null;
}

const DonationPage: React.FC<DonationPageProps> = ({ user }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const store = getStoreData();
  
  const [phone, setPhone] = useState(user?.phone || '');
  const [name, setName] = useState(user?.name || '');
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<DonationType>(
    (searchParams.get('type') as any) || DonationType.SADAQAH
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const predefined = store.settings.predefined_amounts || [200, 500, 800, 1000, 2000];
  const currency = store.settings.currency_symbol || '৳';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !phone) return alert('সঠিক তথ্য প্রদান করুন');

    setIsProcessing(true);
    
    setTimeout(() => {
      try {
        const data = getStoreData();
        let targetUser = data.users.find(u => u.phone === phone);
        if (!targetUser) {
          targetUser = {
            id: `u_${Date.now()}`,
            token_id: phone,
            mobile_number: phone,
            phone,
            name: name || 'Anonymous Donor',
            role: UserRole.USER,
            balance: 0,
            total_contributed: 0,
            assigned_monthly_amount: 500,
            status: 'Active',
            auto_invoice_enabled: true,
            user_type: UserType.REGULAR,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          data.users.push(targetUser);
          saveStoreData(data);
        }

        addDonation({
          userId: targetUser.id,
          amount,
          type: category,
          method: PaymentMethod.BKASH,
          performerId: 'SYSTEM',
          performerType: 'SYSTEM'
        });

        setIsProcessing(false);
        alert('আপনার দান সফলভাবে গৃহীত হয়েছে। জাযাকাল্লাহু খাইরান।');
        navigate('/dashboard');
      } catch (err) {
        setIsProcessing(false);
        alert('দুঃখিত! ট্রানজেকশন প্রসেস করা সম্ভব হয়নি।');
      }
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 md:py-20 animate-fadeIn font-sans">
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 grid grid-cols-1 lg:grid-cols-5">
        
        <div className="lg:col-span-2 bg-primary p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="mosque-pattern absolute inset-0 opacity-10"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-black mb-6 leading-tight uppercase tracking-tighter">আল্লাহর রাহে দান করুন</h1>
            <p className="text-white/70 font-medium mb-10 text-sm">আপনার প্রতিটি অর্থ সরাসরি মসজিদের উন্নয়ন এবং সামাজিক কল্যাণে ব্যবহৃত হবে।</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <i className="fas fa-shield-alt text-accent"></i>
                <p className="text-xs font-bold uppercase tracking-widest">নিরাপদ পেমেন্ট গেটওয়ে</p>
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-file-invoice text-accent"></i>
                <p className="text-xs font-bold uppercase tracking-widest">ডিজিটাল রশিদ ডাউনলোড</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-[10px] font-black text-gray-400 mb-4 uppercase tracking-[0.2em]">টাকার পরিমাণ (Amount)</label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {predefined.map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={`py-4 rounded-xl border-2 font-black transition-all text-sm ${
                      amount === val ? 'bg-primary text-white border-primary shadow-lg' : 'bg-gray-50 text-gray-400 border-gray-100 hover:border-primary/20'
                    }`}
                  >
                    {val}{currency}
                  </button>
                ))}
              </div>
              <div className="relative">
                 <input
                  type="number"
                  placeholder="অন্যান্য পরিমাণ..."
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none text-4xl font-black text-primary transition-all shadow-inner tabular-nums"
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-200 font-black text-2xl uppercase">BDT</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">হাদিয়ার ধরন</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl font-black text-[10px] uppercase outline-none focus:border-primary cursor-pointer shadow-sm"
                >
                  <option value={DonationType.MONTHLY}>মাসিক হাদিয়া</option>
                  <option value={DonationType.WEEKLY}>সাপ্তাহিক হাদিয়া</option>
                  <option value={DonationType.SADAQAH}>এককালীন দান / সাদাকাহ</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">মোবাইল নম্বর</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  disabled={!!user}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl font-black outline-none focus:border-primary shadow-sm"
                  placeholder="০১XXXXXXXXX"
                />
              </div>
            </div>

            {!user && (
              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">আপনার নাম (ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold outline-none focus:border-primary shadow-sm"
                  placeholder="আপনার নাম লিখুন"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing || amount <= 0}
              className={`w-full py-6 rounded-[2rem] font-black text-lg uppercase tracking-[0.2em] text-white shadow-2xl transition-all active:scale-95 flex items-center justify-center ${
                isProcessing || amount <= 0 ? 'bg-gray-200 cursor-not-allowed text-gray-400 shadow-none' : 'bg-primary hover:bg-secondary shadow-green-100'
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <i className="fas fa-spinner fa-spin mr-3"></i> প্রসেসিং...
                </span>
              ) : (
                <>
                  <i className="fas fa-hand-holding-heart mr-3"></i>
                  পেমেন্ট করুন ({amount}{currency})
                </>
              )}
            </button>
            <p className="text-[9px] text-center font-black text-gray-400 uppercase tracking-widest">
               Secure Payment via bKash / Nagad / SSLCommerz
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;
