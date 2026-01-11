
import React from 'react';
import { Link } from 'react-router-dom';
import { getStoreData } from '../store';

const Home: React.FC = () => {
  const store = getStoreData();
  const currentMonthStr = new Date().toISOString().substring(0, 7);
  
  const monthlyTotal = store.donations
    .filter(t => t.status === 'Paid' && t.created_at.startsWith(currentMonthStr))
    .reduce((sum, t) => sum + t.amount, 0);
  
  const goalPercent = Math.min(100, Math.round((monthlyTotal / store.settings.monthly_goal_amount) * 100));

  return (
    <div className="animate-fadeIn pb-20 bg-[#f8faf9] font-sans">
      {/* Dynamic Hero Section */}
      <section className="relative bg-primary pt-24 pb-48 px-6 overflow-hidden mosque-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
            বোচাগঞ্জ আহলে হাদীস <br /> <span className="text-accent italic">কেন্দ্রীয় জামে মসজিদ</span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            একটি স্বচ্ছ ও আধুনিক মসজিদ পরিচালনা ব্যবস্থার অংশ হোন। আপনার দান মসজিদের উন্নয়ন ও মানবতার কল্যাণে সরাসরি ভূমিকা রাখে।
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/donate" className="bg-accent text-primary px-12 py-5 rounded-[2.5rem] font-black text-sm uppercase shadow-2xl hover:scale-105 transition-all">এখনই দান করুন</Link>
            <Link to="/prayer-times" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-[2.5rem] font-black text-sm uppercase hover:bg-white/20">নামাজের সময়সূচী</Link>
          </div>
        </div>
      </section>

      {/* Financial Progress & Stats */}
      <div className="max-w-6xl mx-auto -mt-24 px-4 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl border border-gray-100 flex flex-col justify-between overflow-hidden relative group">
              <div className="mosque-pattern absolute inset-0 opacity-[0.02] group-hover:opacity-10 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-end mb-10">
                   <div>
                     <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4">মাসিক সংগ্রহের লক্ষ্যমাত্রা</p>
                     <h2 className="text-5xl md:text-6xl font-black text-primary tabular-nums tracking-tighter leading-none">{monthlyTotal.toLocaleString()}<span className="text-xl ml-2 opacity-30">৳</span></h2>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">গোল: {store.settings.monthly_goal_amount.toLocaleString()}৳</p>
                     <div className="text-3xl font-black text-accent">{goalPercent}%</div>
                   </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-5 overflow-hidden shadow-inner mb-6">
                   <div className="bg-primary h-full rounded-full transition-all duration-1000 shadow-lg relative" style={{ width: `${goalPercent}%` }}>
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                   </div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-primary/5 rounded-[2rem] border border-primary/10 relative z-10">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                   <i className="fas fa-chart-line text-xl"></i>
                </div>
                <p className="text-xs font-bold text-gray-600 leading-relaxed">স্বচ্ছতা নিশ্চিত করতে আমাদের সকল আর্থিক হিসাব পাবলিক লেজারে নিয়মিত আপডেট করা হয়।</p>
              </div>
           </div>
           
           <div className="bg-emerald-950 p-10 md:p-12 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden flex flex-col justify-between group">
              <div className="mosque-pattern absolute inset-0 opacity-10"></div>
              <div className="relative z-10">
                 <div className="flex justify-between items-center mb-10">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">আজকের ওয়াক্ত</h4>
                    <span className="w-2 h-2 bg-accent rounded-full animate-ping"></span>
                 </div>
                 <div className="space-y-6">
                    <PrayerRow name="ফজর" time="৫:১৫ AM" />
                    <PrayerRow name="যোহর" time="১:৩০ PM" />
                    <PrayerRow name="মাগরিব" time="৬:০৫ PM" />
                 </div>
              </div>
              <Link to="/prayer-times" className="relative z-10 mt-10 w-full py-5 bg-white/10 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest text-center hover:bg-white/20 transition-all border border-white/10">বিস্তারিত সময়সূচী <i className="fas fa-arrow-right ml-2 text-accent"></i></Link>
           </div>
        </div>
      </div>

      {/* Hadith & Motivation */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <div className="text-center mb-20">
           <h2 className="text-4xl font-black text-gray-800 tracking-tight uppercase mb-4">পবিত্র কুরআন ও সুন্নাহর আলো</h2>
           <div className="h-1.5 w-20 bg-accent mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <MotivationCard icon="fa-mosque" title="জান্নাতের ঘর" text="যে ব্যক্তি আল্লাহর জন্য একটি মসজিদ নির্মাণ করবে, আল্লাহ তার জন্য জান্নাতে একটি ঘর নির্মাণ করবেন।" refName="সহীহ বুখারী" />
          <MotivationCard icon="fa-hand-holding-heart" title="সম্পদের বরকত" text="সাদাকাহ করলে সম্পদ কমে না, বরং আল্লাহ তা দশ গুণ বাড়িয়ে দেন। এটি সম্পদের পবিত্রতা আনয়ন করে।" refName="সহীহ মুসলিম" />
          <MotivationCard icon="fa-infinity" title="সদকায়ে জারিয়া" text="মৃত্যুর পর তিনটি আমল জারি থাকে; যার মধ্যে অন্যতম হলো সাদকায়ে জারিয়া যা মানষকে উপকৃত করে।" refName="সহীহ মুসলিম" />
        </div>
      </section>

      {/* Quick Access Grid */}
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
         <QuickLink to="/transparency" icon="fa-shield-halved" label="আর্থিক স্বচ্ছতা" />
         <QuickLink to="/committee" icon="fa-users" label="কমিটি" />
         <QuickLink to="/notices" icon="fa-bullhorn" label="নোটিশ বোর্ড" />
         <QuickLink to="/gallery" icon="fa-images" label="ফটোগ্যালারী" />
      </div>
    </div>
  );
};

const QuickLink = ({ to, icon, label }: any) => (
  <Link to={to} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 flex flex-col items-center justify-center gap-4 hover:bg-primary hover:text-white transition-all group">
    <i className={`fas ${icon} text-3xl text-primary group-hover:text-accent transition-colors`}></i>
    <span className="text-[10px] font-black uppercase tracking-widest text-center">{label}</span>
  </Link>
);

const PrayerRow = ({ name, time }: any) => (
  <div className="flex justify-between items-center border-b border-white/5 pb-4">
    <span className="text-[13px] font-bold text-white/50">{name}</span>
    <span className="font-black text-base tracking-widest uppercase">{time}</span>
  </div>
);

const MotivationCard = ({ icon, title, text, refName }: any) => (
  <div className="bg-white p-12 rounded-[3.5rem] border border-gray-50 shadow-xl hover:shadow-2xl transition-all group border-t-[8px] border-t-primary relative overflow-hidden">
    <div className="w-16 h-16 bg-primary/5 text-primary rounded-[1.5rem] flex items-center justify-center text-3xl mb-10 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
      <i className={`fas ${icon}`}></i>
    </div>
    <h3 className="text-xl font-black text-gray-800 mb-6">{title}</h3>
    <p className="text-gray-500 font-medium leading-relaxed italic mb-10 text-sm">"{text}"</p>
    <div className="flex items-center gap-4">
       <span className="w-6 h-px bg-accent"></span>
       <span className="text-[9px] font-black text-primary uppercase tracking-widest">{refName}</span>
    </div>
  </div>
);

export default Home;
