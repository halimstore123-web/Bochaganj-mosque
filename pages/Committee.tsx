
import React from 'react';

const Committee: React.FC = () => {
  const members = [
    { name: 'হাজী মোঃ আবদুর রাজ্জাক', role: 'সভাপতি (President)', phone: '০১৭XXXXXXXX', image: 'fa-user-tie' },
    { name: 'মাওলানা মোঃ সাইফুল ইসলাম', role: 'খতিব (Head Imam)', phone: '০১৭XXXXXXXX', image: 'fa-user-graduate' },
    { name: 'মোঃ খোরশেদ আলম', role: 'সাধারণ সম্পাদক (Secretary)', phone: '০১৮XXXXXXXX', image: 'fa-user-tie' },
    { name: 'মোঃ আজিজুল হক', role: 'কোষাধ্যক্ষ (Treasurer)', phone: '০১৯XXXXXXXX', image: 'fa-user-tie' },
    { name: 'মোঃ নজরুল ইসলাম', role: 'সদস্য (Executive Member)', phone: '০১৭XXXXXXXX', image: 'fa-user' },
    { name: 'মোঃ হারুনুর রশিদ', role: 'সদস্য (Executive Member)', phone: '০১৭XXXXXXXX', image: 'fa-user' },
  ];

  return (
    <div className="animate-fadeIn font-sans bg-gray-50 pb-24">
      <section className="bg-primary py-24 px-6 text-center text-white relative mosque-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">পরিচালনা কমিটি</h1>
          <p className="text-lg text-white/70">মসজিদের সুষ্ঠ পরিচালনার দায়িত্বে নিয়োজিত সম্মানিত ব্যক্তিবর্গ</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((m, i) => (
            <div key={i} className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 flex flex-col items-center text-center hover:shadow-2xl transition-all group">
              <div className="w-24 h-24 bg-gray-50 text-gray-300 rounded-[2rem] flex items-center justify-center text-4xl mb-8 border-4 border-white shadow-inner group-hover:bg-primary group-hover:text-white transition-all">
                <i className={`fas ${m.image}`}></i>
              </div>
              <h3 className="text-xl font-black text-gray-800 mb-2">{m.name}</h3>
              <p className="text-xs font-black text-primary uppercase tracking-widest mb-6">{m.role}</p>
              <div className="w-full h-px bg-gray-50 mb-6"></div>
              <div className="flex items-center gap-3 text-gray-400 font-black text-[10px] uppercase tracking-widest">
                <i className="fas fa-phone-alt"></i>
                {m.phone}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Committee;
