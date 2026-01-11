
import React, { useState } from 'react';
import { getStoreData } from '../store';

const AdminAuditLogs: React.FC = () => {
  const store = getStoreData();
  const [filter, setFilter] = useState<'ALL' | 'ADMIN' | 'POS' | 'SYSTEM'>('ALL');

  const filteredLogs = store.audit_logs.filter(log => filter === 'ALL' ? true : log.performed_by_type === filter);

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto animate-fadeIn min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div>
          <h1 className="text-4xl font-black text-gray-800 tracking-tighter uppercase leading-none">Security Audit Vault</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mt-4">Immutable Timeline of Forensic Events</p>
        </div>
        <div className="flex bg-white p-2 rounded-[2rem] border border-gray-100 shadow-xl">
          {(['ALL', 'ADMIN', 'POS', 'SYSTEM'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-8 py-3 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-emerald-950 text-white shadow-xl scale-105' : 'text-gray-400 hover:text-gray-600'}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {filteredLogs.map(log => (
          <div key={log.id} className="bg-white p-10 rounded-[3.5rem] border border-gray-100 flex flex-col lg:flex-row lg:items-center gap-10 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
            <div className="mosque-pattern absolute inset-0 opacity-[0.01]"></div>
            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-3xl shadow-inner flex-shrink-0 transition-transform group-hover:scale-110 ${log.performed_by_type === 'ADMIN' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
              <i className={`fas ${log.action_type === 'Donation' ? 'fa-coins' : log.action_type === 'Security' ? 'fa-shield-halved' : 'fa-fingerprint'}`}></i>
            </div>
            <div className="flex-grow">
               <div className="flex flex-col sm:flex-row justify-between mb-4">
                  <h4 className="font-black text-gray-800 text-xl uppercase tracking-tighter leading-none">{log.action_type} <span className="text-[10px] text-gray-300 font-bold ml-4">({log.performed_by_type})</span></h4>
                  <p className="text-[10px] font-black text-primary uppercase tabular-nums">{new Date(log.timestamp).toLocaleString()}</p>
               </div>
               <p className="text-gray-500 font-bold leading-relaxed">{log.details}</p>
               <p className="text-[8px] font-black text-gray-200 mt-4 uppercase tracking-widest">LOG_HASH: {log.id.slice(-12).toUpperCase()} • ADDR: 127.0.0.1</p>
            </div>
          </div>
        ))}
        {filteredLogs.length === 0 && (
           <div className="py-60 text-center opacity-10 flex flex-col items-center">
              <i className="fas fa-shield-slash text-[12rem] mb-12"></i>
              <h2 className="text-4xl font-black uppercase tracking-[0.5em]">No Records Decrypted</h2>
           </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuditLogs;
