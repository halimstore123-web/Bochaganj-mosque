
import React from 'react';
import { getStoreData } from '../store';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const Transparency: React.FC = () => {
  const store = getStoreData();
  const successfulDonations = store.donations.filter(t => t.status === 'Paid');
  const totalIncome = successfulDonations.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = store.expenses.reduce((sum, e) => sum + e.amount, 0);

  const donationCategories = successfulDonations.reduce((acc: any, curr) => {
    acc[curr.donation_type] = (acc[curr.donation_type] || 0) + curr.amount;
    return acc;
  }, {});

  const pieData = Object.entries(donationCategories).map(([name, value]) => ({ name, value: value as number }));
  const COLORS = ['#0B6623', '#FFD700', '#111827', '#4b5563', '#9ca3af'];

  return (
    <div className="animate-fadeIn font-sans bg-gray-50 pb-32">
      <section className="bg-primary pt-32 pb-48 px-6 text-center text-white relative overflow-hidden mosque-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase leading-tight">Public Ledger</h1>
          <p className="text-xl text-white/70 font-medium italic">"And whatever you spend in charity, He will compensate it." (Qur'an 34:39)</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <StatCard title="Total Collected" value={totalIncome} color="text-primary" icon="fa-hand-holding-dollar" />
          <StatCard title="Total Utilized" value={totalExpense} color="text-red-600" icon="fa-building-columns" />
          <StatCard title="Current Funds" value={totalIncome - totalExpense} color="text-emerald-600" icon="fa-vault" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white p-12 md:p-16 rounded-[4.5rem] shadow-2xl border border-gray-100 relative overflow-hidden">
            <div className="mosque-pattern absolute inset-0 opacity-[0.01]"></div>
            <h3 className="text-2xl font-black text-gray-800 tracking-tighter uppercase mb-12 border-b border-gray-100 pb-8 relative z-10">Fund Sources</h3>
            <div className="h-[400px] relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'}} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-12 md:p-16 rounded-[4.5rem] shadow-2xl border border-gray-100 flex flex-col relative overflow-hidden">
            <div className="mosque-pattern absolute inset-0 opacity-[0.01]"></div>
            <h3 className="text-2xl font-black text-gray-800 tracking-tighter uppercase mb-12 border-b border-gray-100 pb-8 relative z-10">Recent Outflow</h3>
            <div className="space-y-6 flex-grow overflow-y-auto max-h-[400px] custom-scrollbar pr-4 relative z-10">
              {store.expenses.slice(0, 10).map(e => (
                <div key={e.id} className="flex justify-between items-center p-6 bg-gray-50 rounded-[2rem] border border-gray-100 group hover:bg-red-50 hover:border-red-100 transition-all">
                  <div>
                    <p className="font-black text-gray-800 text-lg uppercase leading-none mb-2">{e.title}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(e.expense_date).toLocaleDateString()} • {e.category}</p>
                  </div>
                  <p className="text-2xl font-black text-red-600 tabular-nums">-{e.amount.toLocaleString()}৳</p>
                </div>
              ))}
              {store.expenses.length === 0 && <div className="text-center py-20 opacity-20"><i className="fas fa-file-invoice text-8xl"></i><p className="mt-4 font-black">No expenses recorded yet</p></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color, icon }: any) => (
  <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-gray-100 flex flex-col items-center hover:shadow-2xl transition-all relative overflow-hidden group">
     <div className="mosque-pattern absolute inset-0 opacity-[0.01]"></div>
     <div className={`w-20 h-20 rounded-[2rem] ${color.replace('text-', 'bg-')}/10 ${color} flex items-center justify-center text-3xl mb-8 shadow-inner group-hover:scale-110 transition-transform relative z-10`}>
        <i className={`fas ${icon}`}></i>
     </div>
     <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4 text-center relative z-10">{title}</p>
     <p className={`text-5xl font-black ${color} tracking-tighter tabular-nums leading-none relative z-10`}>৳{value.toLocaleString()}</p>
  </div>
);

export default Transparency;
