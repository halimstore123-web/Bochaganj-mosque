
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, UserRole } from '../types';
import { getStoreData, getOrCreateUser } from '../store';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return alert('সঠিক মোবাইল নম্বর দিন');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 800);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 4) {
      const user = getOrCreateUser(phone);
      onLogin(user);
      navigate('/dashboard');
    } else {
      alert('সঠিক ওটিপি প্রদান করুন (ব্যবহার করুন: 1234)');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 bg-gray-50">
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl w-full max-w-md border border-gray-100 text-center relative overflow-hidden">
        <div className="mosque-pattern absolute inset-0 opacity-[0.03] pointer-events-none"></div>
        <div className="w-20 h-20 bg-primary/5 text-primary rounded-[2rem] flex items-center justify-center text-3xl mx-auto mb-6 shadow-inner relative z-10">
          <i className={`fas ${step === 'phone' ? 'fa-mobile-alt' : 'fa-shield-alt'}`}></i>
        </div>
        <h1 className="text-3xl font-black text-gray-800 tracking-tighter relative z-10">{step === 'phone' ? 'সদস্য লগইন' : 'ভেরিফাই করুন'}</h1>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-3 relative z-10">Bochaganj Mosque ERP Node</p>

        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} className="mt-8 space-y-8 animate-fadeIn relative z-10">
            <div className="space-y-4">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest text-left ml-6">মোবাইল নম্বর</label>
              <input type="text" required className="w-full px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[2rem] focus:border-primary outline-none font-black text-2xl text-center shadow-inner tabular-nums" placeholder="০১XXXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:bg-secondary active:scale-95 transition-all">
              {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'ওটিপি পাঠান'}
            </button>
            <div className="pt-4">
               <Link to="/pos-login" className="text-[9px] font-black text-primary/40 hover:text-primary uppercase tracking-widest">Collector Login (POS)</Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="mt-8 space-y-8 animate-fadeIn relative z-10">
            <div className="space-y-4">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest text-left ml-6">৪ সংখ্যার ওটিপি</label>
              <input type="text" maxLength={4} required className="w-full px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[2rem] focus:border-primary outline-none font-black text-5xl text-center tracking-widest shadow-inner tabular-nums" placeholder="0000" value={otp} onChange={e => setOtp(e.target.value)} />
            </div>
            <button type="submit" className="w-full py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:bg-secondary active:scale-95 transition-all">ভেরিফাই করুন</button>
            <button type="button" onClick={() => setStep('phone')} className="text-[10px] font-black uppercase text-gray-300 hover:text-gray-500 transition-colors">ভুল নম্বর? পরিবর্তন করুন</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
