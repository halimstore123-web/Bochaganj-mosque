
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, UserRole } from '../types';
import { verifyAdminCredentials, createAuditLog } from '../store';

interface AdminLoginProps {
  onLogin: (user: User) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (attempts >= 5) {
      setError('বারংবার ভুল পাসওয়ার্ডের কারণে অ্যাডমিন অ্যাক্সেস সাময়িকভাবে ব্লক করা হয়েছে।');
    }
  }, [attempts]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (attempts >= 5) return;
    
    setIsLoading(true);
    setError('');
    
    // Cryptographic Latency Simulation
    setTimeout(() => {
      const adminUser = verifyAdminCredentials(username, password);
      
      if (adminUser && adminUser.role === UserRole.ADMIN) {
          createAuditLog('Security', adminUser.id, 'ADMIN', 'Master administrative session established via secure vault.', undefined, 'Auth');
          localStorage.setItem('auth_token', btoa(`session_${adminUser.id}_${Date.now()}_vault_sealed`));
          onLogin(adminUser);
          navigate('/admin');
      } else {
          setAttempts(prev => prev + 1);
          setError('অ্যাডমিন পরিচয় বা পাসওয়ার্ড ভুল। প্রবেশাধিকার সংরক্ষিত।');
          createAuditLog('Security', 'SYSTEM', 'SYSTEM', `Unauthorized Admin Access Attempt: ${username}`, undefined, 'Auth');
          setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-950 font-sans p-6 relative overflow-hidden">
      <div className="mosque-pattern absolute inset-0 opacity-10 pointer-events-none"></div>
      
      <div className="bg-white w-full max-w-lg rounded-[4rem] shadow-2xl overflow-hidden relative z-10 animate-scaleIn border border-white/10">
        <div className="bg-emerald-900 p-16 text-center text-white relative">
           <div className="mosque-pattern absolute inset-0 opacity-10 pointer-events-none"></div>
           <div className="w-24 h-24 bg-white/10 rounded-[2.5rem] flex items-center justify-center text-4xl mx-auto mb-8 backdrop-blur-md border border-white/20 shadow-inner group">
              <i className="fas fa-user-shield text-accent group-hover:scale-110 transition-transform"></i>
           </div>
           <h1 className="text-3xl font-black tracking-tighter uppercase leading-none mb-3">Administrator Core</h1>
           <p className="text-[10px] font-black text-accent uppercase tracking-[0.4em] opacity-80 italic">Protected Node: BMMS_SECURED_CORE</p>
        </div>

        <form onSubmit={handleLogin} className="p-16 space-y-12">
           {error && (
             <div className="bg-red-50 text-red-600 p-6 rounded-[2rem] text-center font-black text-xs uppercase tracking-widest border border-red-100 animate-slideDown shadow-inner">
                <i className="fas fa-shield-exclamation mr-3"></i> {error}
             </div>
           )}
           
           <div className="space-y-10">
              <div className="group">
                 <label className="block text-[11px] font-black text-gray-400 uppercase mb-4 ml-6 tracking-widest group-focus-within:text-primary transition-colors">প্রবেশ পরিচয় (Identity)</label>
                 <input 
                    type="text" 
                    required 
                    autoFocus
                    autoComplete="off"
                    className="w-full px-10 py-6 bg-gray-50 border-2 border-gray-100 rounded-[2.5rem] focus:border-primary outline-none transition-all font-bold text-gray-800 shadow-inner"
                    placeholder="Admin Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                 />
              </div>
              <div className="group relative">
                 <label className="block text-[11px] font-black text-gray-400 uppercase mb-4 ml-6 tracking-widest group-focus-within:text-primary transition-colors">সিক্রেট কি (Secret Key)</label>
                 <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    className="w-full px-10 py-6 bg-gray-50 border-2 border-gray-100 rounded-[2.5rem] focus:border-primary outline-none transition-all font-black text-3xl tracking-[0.4em] shadow-inner text-emerald-900"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                 />
                 <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-8 top-[62px] text-gray-300 hover:text-primary transition-colors"
                 >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                 </button>
              </div>
           </div>

           <button 
             type="submit" 
             disabled={isLoading || attempts >= 5}
             className="w-full py-10 bg-emerald-950 text-white rounded-[3rem] font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-emerald-950/30 hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-5 border-b-8 border-emerald-900 disabled:opacity-50"
           >
             {isLoading ? (
               <i className="fas fa-shield-halved fa-spin"></i>
             ) : (
               <>
                 <i className="fas fa-lock-open text-accent text-lg"></i> Authorize Entry
               </>
             )}
           </button>
           
           <div className="text-center pt-8 border-t border-gray-100 flex justify-between items-center">
              <Link to="/" className="text-[9px] font-black text-gray-300 hover:text-primary uppercase tracking-widest transition-colors">
                <i className="fas fa-arrow-left mr-2"></i> Exit Vault
              </Link>
              <p className="text-[9px] font-black text-gray-200 uppercase tracking-widest">
                Forensic Audit Active
              </p>
           </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
