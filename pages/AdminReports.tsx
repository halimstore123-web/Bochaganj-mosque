
import React, { useState } from 'react';
import { getStoreData, exportToCsv } from '../store';
import { UserRole } from '../types';

const AdminReports: React.FC = () => {
  const store = getStoreData();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));

  const exportAllDonations = () => {
    const filtered = store.donations.filter(t => t.created_at.startsWith(selectedMonth));
    const data = filtered.map(t => {
      const u = store.users.find(usr => usr.id === t.user_id);
      return {
        'Receipt UID': t.transactionUid,
        'Donor Name': u?.name || 'Anonymous Member',
        'Mobile ID': u?.mobile_number || 'N/A',
        'Fund Category': t.donation_type,
        'Amount (BDT)': t.amount,
        'Status': t.status,
        'Payment Method': t.payment_method,
        'Collector': t.collectorName || 'System',
        'Verified By': t.verified_by || 'N/A',
        'Timestamp': new Date(t.created_at).toLocaleString(),
        'Internal Hash': t.id
      };
    });
    exportToCsv(data, `Global_Ledger_${selectedMonth}`);
  };

  const exportDefaulters = () => {
    const data = store.users
      .filter(u => u.status === 'Active' && u.assigned_monthly_amount > 0 && u.balance < u.assigned_monthly_amount)
      .map(u => ({
        'Member Identity': u.name || 'Member',
        'Contact ID': u.mobile_number,
        'Monthly Goal (BDT)': u.assigned_monthly_amount,
        'Current Contribution': u.balance,
        'Deficit Amount': u.assigned_monthly_amount - u.balance,
        'Last Active': new Date(u.updated_at).toLocaleDateString(),
        'User Role': u.role
      }));
    exportToCsv(data, `Defaulter_Audit_${selectedMonth}`);
  };

  const exportExpenses = () => {
    const data = store.expenses.map(e => ({
      'Audit Date': new Date(e.expense_date).toLocaleDateString(),
      'Cost Category': e.category,
      'Narration': e.title,
      'Debit Value (BDT)': e.amount,
      'Authorized By': e.added_by_name || 'Admin Core',
      'Expense ID': e.id
    }));
    exportToCsv(data, `Expenditure_Vault_Archive`);
  };

  const exportAuditLogs = () => {
    const data = store.audit_logs.map(log => ({
      'Timestamp': new Date(log.timestamp).toLocaleString(),
      'Action Protocol': log.action_type,
      'Originator': log.performed_by_id,
      'Actor Role': log.performed_by_type,
      'Event Details': log.details,
      'Log Hash': log.id
    }));
    exportToCsv(data, `Forensic_Audit_Timeline`);
  };

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto animate-fadeIn min-h-screen font-sans bg-gray-50 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div>
          <h1 className="text-5xl font-black text-gray-800 tracking-tighter uppercase leading-none">Forensic Intelligence</h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-3">Governance, Transparency & Compliance Terminal</p>
        </div>
        <div className="bg-white p-3 rounded-[2.5rem] shadow-xl border border-gray-100 flex items-center gap-5">
           <label className="text-[10px] font-black uppercase text-gray-300 ml-4">Audit Period</label>
           <input type="month" className="bg-transparent border-0 font-black text-lg outline-none tabular-nums px-6 text-primary" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <ReportCard 
          title="Donation Ledger" 
          desc="Complete record of all verified mosque credits with UID mapping and collector metadata." 
          icon="fa-receipt" 
          color="bg-emerald-600" 
          onExport={exportAllDonations} 
        />
        <ReportCard 
          title="Member Default Audit" 
          desc="Critical analysis of registered members with unmet spiritual-financial commitments." 
          icon="fa-user-clock" 
          color="bg-amber-600" 
          onExport={exportDefaulters} 
        />
        <ReportCard 
          title="Expenditure Vault" 
          desc="Historical breakdown of mosque operational outflows, maintenance, and salary debits." 
          icon="fa-file-invoice-dollar" 
          color="bg-red-600" 
          onExport={exportExpenses} 
        />
        <ReportCard 
          title="System Audit Trail" 
          desc="Full-spectrum forensic log tracking every administrative override and role transition." 
          icon="fa-shield-halved" 
          color="bg-emerald-950" 
          onExport={exportAuditLogs} 
        />
      </div>

      <div className="mt-20 bg-emerald-950 p-16 rounded-[5rem] text-white shadow-2xl relative overflow-hidden">
         <div className="mosque-pattern absolute inset-0 opacity-10"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-center md:text-left">
               <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Ready for Internal Audit?</h3>
               <p className="text-white/60 font-medium max-w-xl">All exported documents contain unique audit hashes and digital timestamps compliant with BMMS transparency protocols. Ensure exported files are handled with appropriate administrative confidentiality.</p>
            </div>
            <div className="bg-white/10 p-8 rounded-[3rem] border border-white/10 text-center min-w-[200px]">
               <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-2">Data Integrity</p>
               <p className="text-2xl font-black">SECURE-V3</p>
            </div>
         </div>
      </div>
    </div>
  );
};

const ReportCard = ({ title, desc, icon, color, onExport }: any) => (
  <div className="bg-white p-12 rounded-[4.5rem] border border-gray-100 shadow-xl flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
    <div className="mosque-pattern absolute inset-0 opacity-[0.01] pointer-events-none"></div>
    <div className="relative z-10">
       <div className={`w-16 h-16 bg-gray-50 ${color.replace('bg-', 'text-')} rounded-[2rem] flex items-center justify-center text-3xl mb-10 group-hover:${color} group-hover:text-white transition-all shadow-inner border border-gray-100`}>
          <i className={`fas ${icon}`}></i>
       </div>
       <h3 className="text-2xl font-black text-gray-800 mb-4 uppercase tracking-tighter leading-none">{title}</h3>
       <p className="text-xs text-gray-400 font-bold leading-relaxed mb-8">{desc}</p>
    </div>
    <button onClick={onExport} className="w-full py-6 bg-gray-50 text-gray-400 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-emerald-950 hover:text-white transition-all flex items-center justify-center gap-4 active:scale-95 relative z-10 shadow-sm">
       <i className="fas fa-file-excel text-emerald-600 group-hover:text-accent"></i> 
       Generate Official Excel
    </button>
  </div>
);

export default AdminReports;
