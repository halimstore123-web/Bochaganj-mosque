
import React, { useState } from 'react';
import { createAuditLog, getStoreData, saveStoreData, updateAdminPassword } from '../store';
import { AppSettings, UserRole } from '../types';

const AdminSettings: React.FC = () => {
  const store = getStoreData();
  const [settings, setSettings] = useState<AppSettings>(store.settings);
  const [isSaving, setIsSaving] = useState(false);
  
  // Security protocol state
  const [passData, setPassData] = useState({ old: '', new: '', confirm: '' });
  const [passError, setPassError] = useState('');
  const [showPassSection, setShowPassSection] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    const data = getStoreData();
    data.settings = { ...settings };
    saveStoreData(data);
    createAuditLog('Admin_Action', 'admin_1', 'ADMIN', 'Global system architecture parameters synchronized.', undefined, 'Settings');
    setTimeout(() => { 
        setIsSaving(false); 
        alert('System architecture successfully synchronized.'); 
    }, 1200);
  };

  const handleRotatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    
    // PASSWORD COMPLEXITY VALIDATION
    // Min 8 chars, at least one uppercase, one lowercase, one digit, one special character
    const complexity = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!complexity.test(passData.new)) {
        setPassError('পাসওয়ার্ড অবশ্যই ৮ অক্ষরের হতে হবে এবং এতে বড় হাত, ছোট হাত, সংখ্যা ও স্পেশাল ক্যারেক্টার থাকতে হবে। (Security Policy Violation)');
        return;
    }

    if (passData.new !== passData.confirm) {
        setPassError('নতুন পাসওয়ার্ড দুটি হুবহু মিলতে হবে।');
        return;
    }

    const adminNode = store.admins.find(a => a.username === 'admin');
    if (adminNode && updateAdminPassword(adminNode.id, passData.old, passData.new)) {
        alert('Master Security Key Rotated Successfully. All active sessions have been invalidated for security. Please re-authenticate.');
        // FORCE LOGOUT TO INVALIDATE LOCAL SESSIONS
        localStorage.removeItem('logged_user');
        localStorage.removeItem('auth_token');
        window.location.href = '#/admin/login';
    } else {
        setPassError('বর্তমান সিকিউরিটি কি সঠিক নয়। (Incorrect Current Password)');
    }
  };

  return (
    <div className="p-4 md:p-10 max-w-5xl mx-auto animate-fadeIn bg-white min-h-screen rounded-[5rem] mt-6 border border-gray-100 shadow-2xl mb-32 font-sans relative overflow-hidden">
      <div className="mosque-pattern absolute inset-0 opacity-[0.01]"></div>
      <div className="p-16 relative z-10">
        <div className="mb-16 border-b border-gray-100 pb-12 flex flex-col md:flex-row justify-between items-end gap-10">
          <div>
            <h1 className="text-5xl font-black text-gray-800 tracking-tighter uppercase leading-none">Settings Panel</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] mt-5">Architecture Management & Security Protocols</p>
          </div>
          <button onClick={handleSave} disabled={isSaving} className="bg-emerald-950 text-white px-14 py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-black transition-all active:scale-95 flex items-center gap-5 border-b-8 border-emerald-900 group">
            {isSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-shield-check text-accent group-hover:scale-125 transition-transform"></i>}
            Sync System Core
          </button>
        </div>

        <div className="grid grid-cols-1 gap-20">
          <section>
            <div className="flex items-center gap-8 mb-12">
               <div className="w-20 h-20 bg-primary/5 text-primary rounded-[2.5rem] flex items-center justify-center text-3xl shadow-inner border border-primary/5"><i className="fas fa-mosque"></i></div>
               <h3 className="text-sm font-black text-gray-800 uppercase tracking-[0.4em]">Organization Identity</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <SettingsInput label="Full Mosque Name (Official)" value={settings.mosque_name} onChange={(v: string) => setSettings({...settings, mosque_name: v})} />
              <SettingsInput label="Establishment Year" value={settings.establishment_year} onChange={(v: string) => setSettings({...settings, establishment_year: v})} />
              <div className="md:col-span-2"><SettingsInput label="Official/Postal Physical Address" value={settings.address} onChange={(v: string) => setSettings({...settings, address: v})} /></div>
              <div className="space-y-4">
                 <label className="block text-[11px] font-black text-gray-400 uppercase ml-6 tracking-widest">Global Language Locale</label>
                 <select className="w-full px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[2rem] font-black text-[10px] uppercase outline-none focus:border-primary transition-all" value={settings.language_default} onChange={e => setSettings({...settings, language_default: e.target.value as any})}>
                    <option value="Bangla">বাংলা (Default)</option>
                    <option value="English">English</option>
                 </select>
              </div>
              <div className="space-y-4">
                 <label className="block text-[11px] font-black text-gray-400 uppercase ml-6 tracking-widest">Monthly Collection Target</label>
                 <div className="relative">
                    <input type="number" className="w-full px-10 py-7 bg-gray-50 border-2 border-gray-100 rounded-[2.5rem] font-black text-4xl outline-none focus:border-primary shadow-inner text-primary tabular-nums" value={settings.monthly_goal_amount} onChange={e => setSettings({...settings, monthly_goal_amount: Number(e.target.value)})} />
                    <span className="absolute right-10 top-1/2 -translate-y-1/2 font-black text-primary/20 text-3xl">{settings.currency_symbol}</span>
                 </div>
              </div>
            </div>
          </section>

          <section className="pt-16 border-t border-gray-100">
             <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-red-50 text-red-600 rounded-[2.5rem] flex items-center justify-center text-3xl shadow-inner border border-red-50"><i className="fas fa-key-skeleton-left"></i></div>
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-[0.4em]">Administrative Access Vault</h3>
                </div>
                <button onClick={() => setShowPassSection(!showPassSection)} className="text-[10px] font-black text-primary uppercase border-b-2 border-primary/20 pb-1 hover:text-emerald-700 transition-colors">
                  {showPassSection ? 'Hide Security Panel' : 'Manage Credentials'}
                </button>
            </div>
            
            {showPassSection && (
              <form onSubmit={handleRotatePassword} className="bg-red-50/30 p-14 rounded-[4rem] border border-red-100 animate-slideDown shadow-inner">
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-10 border-b border-red-100 pb-4 flex items-center gap-3"><i className="fas fa-triangle-exclamation"></i> Security Warning: Mandatory Identity Rotation Protocol</p>
                  {passError && <div className="mb-8 p-6 bg-red-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase text-center animate-pulse shadow-xl">{passError}</div>}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="md:col-span-2">
                         <SettingsInput type="password" label="Verification: Current Admin Password" value={passData.old} onChange={(v: string) => setPassData({...passData, old: v})} />
                      </div>
                      <SettingsInput type="password" label="New Master Security Key" value={passData.new} onChange={(v: string) => setPassData({...passData, new: v})} />
                      <SettingsInput type="password" label="Confirm Master Security Key" value={passData.confirm} onChange={(v: string) => setPassData({...passData, confirm: v})} />
                  </div>
                  <div className="mt-10 p-8 bg-white/60 border-2 border-dashed border-red-200 rounded-[2.5rem]">
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-[0.2em] leading-relaxed">পাসওয়ার্ড পলিসি: পাসওয়ার্ড অবশ্যই ৮ অক্ষরের হতে হবে এবং এতে একটি বড় হাত (A), ছোট হাত (a), সংখ্যা (1) ও স্পেশাল ক্যারেক্টার (@) থাকতে হবে। এটি সিস্টেমের সর্বোচ্চ স্তরের নিরাপত্তা নিশ্চিত করবে।</p>
                  </div>
                  <button type="submit" className="mt-10 w-full py-8 bg-red-600 text-white rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center gap-5 border-b-8 border-red-900 group">
                     <i className="fas fa-sync group-hover:rotate-180 transition-transform duration-500"></i> Authorize Security Rotation
                  </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

const SettingsInput = ({ label, value, onChange, type = "text" }: any) => (
  <div className="space-y-4 group">
    <label className="block text-[11px] font-black text-gray-400 uppercase mb-4 ml-8 tracking-widest group-focus-within:text-primary transition-colors">{label}</label>
    <input type={type} className="w-full px-10 py-7 bg-gray-50 border-2 border-gray-100 rounded-[2.5rem] font-black text-2xl focus:border-primary outline-none transition-all shadow-inner text-gray-800" value={value} onChange={e => onChange(e.target.value)} />
  </div>
);

export default AdminSettings;
