
import React from 'react';

const PrayerTimes: React.FC = () => {
  const times = [
    { name: 'ফজর (Fajr)', start: '৫:০৪ AM', jamah: '৫:৩০ AM', icon: 'fa-sun-haze' },
    { name: 'যোহর (Dhuhr)', start: '১২:১৫ PM', jamah: '১:৩০ PM', icon: 'fa-sun' },
    { name: 'আসর (Asr)', start: '৪:১০ PM', jamah: '৪:৪৫ PM', icon: 'fa-cloud-sun' },
    { name: 'মাগরিব (Maghrib)', start: '৬:০৫ PM', jamah: '৬:১০ PM', icon: 'fa-sunset' },
    { name: 'ইশা (Isha)', start: '৭:৩০ PM', jamah: '৮:১৫ PM', icon: 'fa-moon' },
    { name: 'জুমা (Jummah)', start: '---', jamah: '১:৩০ PM', icon: 'fa-mosque' },
  ];

  return (
    <div className="animate-fadeIn font-sans bg-gray-50 pb-20">
      <section className="bg-primary pt-24 pb-48 px-6 mosque-pattern relative overflow-hidden text-center text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 to-primary"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase">নামাজের সময়সূচী</h1>
          <p className="text-xl text-white/80 font-medium">বোচাগঞ্জ আহলে হাদীস কেন্দ্রীয় জামে মসজিদ - {new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto -mt-24 px-4 relative z-20">
        <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-emerald-950 p-8 text-center border-b border-white/10">
             <span className="text-accent font-black text-xs uppercase tracking-[0.4em]">Daily Prayer Matrix</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-gray-50">
            {times.map((t, idx) => (
              <div key={idx} className="p-10 hover:bg-primary/5 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-primary/5 text-primary rounded-2xl flex items-center justify-center text-2xl group-hover:bg-primary group-hover:text-white transition-all">
                    <i className={`fas ${t.icon}`}></i>
                  </div>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Active Schedule</span>
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-6">{t.name}</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-3">
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">ওয়াক্ত শুরু</span>
                    <span className="font-black text-gray-700">{t.start}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-black uppercase tracking-widest text-[10px]">জামাত</span>
                    <span className="font-black text-primary text-xl">{t.jamah}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-10 bg-gray-50 border-t border-gray-100 text-center">
             <p className="text-xs text-gray-500 font-medium">বিশেষ দ্রষ্টব্য: আবহাওয়ার কারণে জামাতের সময় সামান্য পরিবর্তিত হতে পারে।</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimes;
