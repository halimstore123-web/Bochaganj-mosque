
import React from 'react';
import { getStoreData } from '../store';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AdminDashboard: React.FC = () => {
  const store = getStoreData();
  const successfulDonations = store.donations.filter(t => t.status === 'Paid');
  const totalIncome = successfulDonations.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = store.expenses.reduce((sum, e) => sum + e.amount, 0);
  
  const chartData = [
    { name: 'আয় (Income)', value: totalIncome, color: '#0B6623' },
    { name: 'ব্যয় (Expense)', value: totalExpense, color: '#dc2626' }
  ];

  const pendingCount = store.donations.filter(d => d.status === 'Pending').length;

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto animate-fadeIn font-sans pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div>
          <h1 className="text-5xl font-black text-gray-800 tracking-tighter uppercase leading-none">Command Center</h1>
          <p className="text-gray-400 font-bold uppercase text-[9px] tracking-[0.4em] mt-4">Forensic Intelligence & Operational Oversight</p>
        </div>
        <div className="flex gap-4">
          <Link to="/admin/manual-payment" className="bg-emerald-950 text-white px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-black transition-all border-b-8 border-emerald-900 active:translate-y-1">
            <i className="fas fa-plus-circle mr-3 text-accent"></i> Manual Entry
          </Link>
          {pendingCount > 0 && (
            <Link to="/admin/donations" className="bg-amber-500 text-white px-8 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-2xl animate-pulse">
              {pendingCount} Verifications Pending
            </Link>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
        <StatCard title="Total Revenue" value={totalIncome} icon="fa-arrow-up" color="text-emerald-600" />
        <StatCard title="Total Expense" value={totalExpense} icon="fa-arrow-down" color="text-red-600" />
        <StatCard title="Net Liquidity" value={totalIncome - totalExpense} icon="fa-vault" color="text-primary" />
        <StatCard title="Registered Members" value={store.users.length} icon="fa-users" color="text-blue-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 bg-white p-14 rounded-[5rem] border border-gray-100 shadow-2xl overflow-hidden relative group">
          <div className="mosque-pattern absolute inset-0 opacity-[0.01]"></div>
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-[0.3em] mb-12 border-b border-gray-50 pb-8 flex items-center justify-between">
            <span><i className="fas fa-chart-line mr-4 text-primary"></i> Spiritual-Financial Flux</span>
            <span className="text-[10px] text-gray-300">Archive Mode: Active</span>
          </h3>
          <div className="h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} fontWeight={900} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} fontWeight={900} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '30px', border: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.1)', padding: '20px'}} />
                <Bar dataKey="value" radius={[25, 25, 0, 0]} barSize={120}>
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="bg-white p-12 rounded-[5rem] border border-gray-100 shadow-2xl">
            <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] mb-10 text-center">Admin Modules</h3>
            <div className="grid grid-cols-2 gap-6">
              <ModuleLink to="/admin/users" icon="fa-users-gear" label="Members" />
              <ModuleLink to="/admin/accounting" icon="fa-money-bill-transfer" label="Ledger" />
              <ModuleLink to="/admin/donations" icon="fa-shield-check" label="Approve" />
              <ModuleLink to="/admin/pos-control" icon="fa-cash-register" label="Terminals" />
              <ModuleLink to="/admin/reports" icon="fa-file-invoice" label="Reports" />
              <ModuleLink to="/admin/audit-logs" icon="fa-fingerprint" label="Security" />
              <ModuleLink to="/admin/receipts" icon="fa-receipt" label="Receipts" />
              <ModuleLink to="/admin/settings" icon="fa-gears" label="Settings" />
            </div>
          </div>
          
          <div className="bg-emerald-950 p-12 rounded-[5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="mosque-pattern absolute inset-0 opacity-10"></div>
            <h4 className="text-[10px] font-black text-accent uppercase tracking-widest mb-8 border-b border-white/10 pb-4 flex justify-between">
              <span>Security Event Stream</span>
              <i className="fas fa-radar animate-ping text-[6px]"></i>
            </h4>
            <div className="space-y-6">
              {store.audit_logs.slice(0, 4).map(log => (
                <div key={log.id} className="text-[10px] leading-relaxed border-b border-white/5 pb-4 last:border-0 group/log">
                  <div className="flex justify-between mb-2">
                    <span className="text-accent font-black">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className="opacity-30 group-hover/log:opacity-100 transition-opacity">ID: {log.id.slice(-6)}</span>
                  </div>
                  <p className="opacity-70 font-medium">{log.details}</p>
                </div>
              ))}
            </div>
            <Link to="/admin/audit-logs" className="mt-10 block text-center text-[9px] font-black uppercase text-accent/40 hover:text-accent transition-all">Deep Forensic View <i className="fas fa-arrow-right ml-2"></i></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="bg-white p-12 rounded-[4.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden group">
    <div className="mosque-pattern absolute inset-0 opacity-[0.01]"></div>
    <div className={`${color} bg-gray-50 w-20 h-20 flex items-center justify-center rounded-[2rem] text-3xl mb-10 group-hover:bg-primary group-hover:text-white transition-all shadow-inner`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <p className="text-[11px] font-black text-gray-400 uppercase mb-4 tracking-widest leading-none">{title}</p>
    <h3 className={`text-4xl font-black ${color} tracking-tighter tabular-nums leading-none`}>৳{value.toLocaleString()}</h3>
  </div>
);

const ModuleLink = ({ to, icon, label }: any) => (
  <Link to={to} className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-[3rem] hover:bg-emerald-950 hover:text-white transition-all group active:scale-95 shadow-inner border border-gray-100/50">
    <i className={`fas ${icon} text-2xl mb-4 opacity-30 group-hover:opacity-100 group-hover:text-accent transition-all group-hover:scale-110`}></i>
    <span className="text-[9px] font-black uppercase tracking-widest text-center leading-none">{label}</span>
  </Link>
);

export default AdminDashboard;
