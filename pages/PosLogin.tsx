
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, UserRole } from '../types';
import { getStoreData, createAuditLog, verifyAdminCredentials } from '../store';

interface PosLoginProps {
  onLogin: (user: User) => void;
}

const PosLogin: React.FC<PosLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('Access Denied');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);

    // Secure auth delay
    setTimeout(() => {
        const store = getStoreData();
        
        // DUAL ACCESS: Admins can override POS entry
        if (username === 'admin') {
            const adminUser = verifyAdminCredentials(username, password);
            if (adminUser) {
                createAuditLog('Security', adminUser.id, 'ADMIN', 'Master Terminal Session initialized via Root Credentials');
                onLogin(adminUser);
                navigate('/pos');
                return;
            }
        }

        // STANDARD POS OPERATOR AUTH
        const posOperator = store.users.find(u => 
            (u.token_id === username || u.mobile_number === username) && 
            u.posPin === password && 
            u.role === UserRole.POS
        );

        if (posOperator) {
            if (posOperator.status === 'Blocked') {
                setErrorMsg('Terminal Node Blocked');
                setIsError(true);
                setIsLoading(false);
                return;
            }
            createAuditLog('POS_Action', posOperator.id, 'POS', 'Operator shift started on Terminal Node');
            onLogin(posOperator);
            navigate('/pos');
            return;
        }

        setIsError(true);
        setErrorMsg('Invalid Terminal Credentials');
        setIsLoading(false);
        createAuditLog('Security', 'SYSTEM', 'SYSTEM', `Failed Terminal Auth Attempt: ${username}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 font-sans p-6 relative overflow-hidden">
      <div className="mosque-pattern absolute inset-0 opacity-10 pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-zinc-900 rounded-[4rem] shadow-2xl overflow-hidden border border-white/5 relative z-10 animate-scaleIn">
        <div className="p-16 text-center bg-emerald-950 relative">
          <div className="mosque-pattern absolute inset-0 opacity-20 pointer-events-none"></div>
          <div className="w-24 h-24 bg-accent rounded-[2.5rem] flex items-center justify-center text-primary text-5xl mx-auto mb-10 shadow-2xl animate-pulse">
            <i className="fas fa-fingerprint"></i>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2 leading-none">POS AUTH</h1>
          <p className="text-[10px] font-black text-accent/60 uppercase tracking-[0.5em]">Forensic Counter-Node Access</p>
        </div>

        <form onSubmit={handleLogin} className="p-16 space-y-12">
          {isError && (
            <div className="bg-red-500/10 text-red-500 p-8 rounded-[2rem] text-center font-black text-xs uppercase border border-red-500/20 animate-slideDown shadow-inner">
              <i className="fas fa-exclamation-triangle mr-3"></i> {errorMsg}
            </div>
          )}

          <div className="space-y-10">
            <div className="group">
              <label className="block text-[11px] font-black text-white/30 uppercase mb-4 ml-6 tracking-widest group-focus-within:text-accent transition-colors">Operator UID</label>
              <input 
                type="text" 
                required 
                autoFocus
                className="w-full px-10 py-6 bg-black border-2 border-white/5 focus:border-accent outline-none text-white font-bold rounded-[2rem] transition-all shadow-inner placeholder:text-zinc-800"
                placeholder="Username / Phone"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div className="group">
              <label className="block text-[11px] font-black text-white/30 uppercase mb-4 ml-6 tracking-widest group-focus-within:text-accent transition-colors">Security PIN</label>
              <input 
                type="password" 
                required 
                className="w-full px-10 py-6 bg-black border-2 border-white/5 focus:border-accent outline-none text-white font-black text-7xl text-center tracking-[0.6em] rounded-[2rem] transition-all shadow-inner placeholder:text-zinc-800"
                placeholder="••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-10 bg-accent text-primary rounded-[3rem] font-black text-xl uppercase tracking-[0.4em] shadow-2xl hover:bg-yellow-400 transition-all active:scale-95 disabled:opacity-30 border-b-8 border-yellow-700"
          >
            {isLoading ? <i className="fas fa-shield-halved fa-spin"></i> : 'Authorize Access'}
          </button>
          
          <div className="text-center pt-4">
            <Link to="/" className="text-[10px] font-black text-white/20 hover:text-white uppercase tracking-widest transition-colors flex items-center justify-center gap-3">
              <i className="fas fa-arrow-left"></i> Portal Home
            </Link>
          </div>
        </form>
      </div>
      
      <p className="mt-16 text-[10px] font-black text-white/10 uppercase tracking-[0.8em] pointer-events-none">Forensic Trace Logging Active</p>
    </div>
  );
};

export default PosLogin;
