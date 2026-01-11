
import React from 'react';

const Notices: React.FC = () => {
  const notices = [
    {
      date: '২৪ মে, ২০২৪',
      title: 'নতুন হিফজখানা উদ্বোধন',
      content: 'আলহামদুলিল্লাহ, আমাদের মসজিদে নতুন হিফজখানা শাখার কার্যক্রম আগামী ১লা জুন থেকে শুরু হতে যাচ্ছে।',
      category: 'শিক্ষা',
      urgency: 'Normal'
    },
    {
      date: '২০ মে, ২০২৪',
      title: 'সীরাত সম্মেলন - ২০২৪',
      content: 'মসজিদ কমিটির উদ্যোগে আগামী শুক্রবার বাদ আছর এক বিশাল সীরাত সম্মেলন অনুষ্ঠিত হবে। সকল মুসলিম ভাইদের আমন্ত্রণ।',
      category: 'ইভেন্ট',
      urgency: 'High'
    },
    {
      date: '১৫ মে, ২০২৪',
      title: 'মসজিদ সংস্কার কাজের আপডেট',
      content: 'মসজিদের দ্বিতীয় তলার ছাদ ঢালাইয়ের কাজ সম্পন্ন হয়েছে। আপনাদের দান ও দোয়ার জন্য জাযাকাল্লাহ।',
      category: 'উন্নয়ন',
      urgency: 'Normal'
    }
  ];

  return (
    <div className="animate-fadeIn font-sans bg-gray-50 pb-20">
      <section className="bg-primary pt-24 pb-48 px-6 text-center text-white relative mosque-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">নোটিশ ও ঘোষণা</h1>
          <p className="text-lg text-white/70">মসজিদের সকল কার্যক্রম এবং গুরুত্বপূর্ণ ঘোষণা এখান থেকে জানুন</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 -mt-24 relative z-20">
        <div className="space-y-8">
          {notices.map((n, i) => (
            <div key={i} className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 flex flex-col md:flex-row gap-8 hover:shadow-2xl transition-all group">
              <div className="md:w-32 flex-shrink-0 text-center border-b md:border-b-0 md:border-r border-gray-50 pb-6 md:pb-0 md:pr-8">
                <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">{n.category}</p>
                <div className="bg-primary/5 rounded-2xl p-4">
                  <p className="text-lg font-black text-gray-800 leading-tight">{n.date.split(',')[0]}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{n.date.split(',')[1]}</p>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-black text-gray-800 group-hover:text-primary transition-colors">{n.title}</h3>
                  {n.urgency === 'High' && (
                    <span className="bg-red-50 text-red-500 text-[8px] font-black uppercase px-3 py-1 rounded-full border border-red-100 animate-pulse">জরুরী</span>
                  )}
                </div>
                <p className="text-gray-500 font-medium leading-relaxed">{n.content}</p>
                <div className="mt-8 flex gap-4">
                  <button className="text-[10px] font-black text-primary uppercase border-b-2 border-primary/20 hover:border-primary transition-all pb-1">বিস্তারিত পড়ুন</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notices;
