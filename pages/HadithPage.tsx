
import React, { useState } from 'react';

const HadithPage: React.FC = () => {
  const [lang, setLang] = useState<'bn' | 'en'>('bn');

  const hadithData = [
    {
      bn: "“সাদাকাহ গুনাহকে মিটিয়ে দেয় যেমন পানি আগুনকে নিভিয়ে দেয়।”",
      en: '"Charity extinguishes sins as water extinguishes fire."',
      ref: "Sahih at-Tirmidhi",
      category: "দান ও সাদাকাহ"
    },
    {
      bn: "“যে ব্যক্তি আল্লাহর সন্তুষ্টির জন্য একটি মসজিদ নির্মাণ করবে, আল্লাহ তার জন্য জান্নাতে একটি ঘর নির্মাণ করবেন।”",
      en: '"Whoever builds a mosque for the sake of Allah, Allah will build for him a house in Paradise."',
      ref: "Sahih Bukhari",
      category: "মসজিদ নির্মাণ"
    },
    {
      bn: "“দান করলে সম্পদ কমে না, বরং আল্লাহ তা বাড়িয়ে দেন।”",
      en: '"Wealth is not diminished by giving in charity."',
      ref: "Sahih Muslim",
      category: "সম্পদের বরকত"
    },
    {
      bn: "“মানুষ যখন মারা যায় তখন তার আমল বন্ধ হয়ে যায়, তিনটি আমল ছাড়া: সদকায়ে জারিয়া, উপকারী ইলম এবং নেক সন্তান যে তার জন্য দোয়া করে।”",
      en: '"When a person dies, his deeds come to an end except for three: Ongoing charity (Sadaqah Jariyah), knowledge that is benefited from, and a righteous child who prays for him."',
      ref: "Sahih Muslim",
      category: "সদকায়ে জারিয়া"
    }
  ];

  return (
    <div className="animate-fadeIn font-sans bg-gray-50 pb-24">
      <section className="bg-primary py-24 px-6 text-center text-white relative overflow-hidden mosque-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="mb-6 flex justify-center">
             <button onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')} className="bg-white/10 text-white border border-white/20 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                {lang === 'bn' ? 'English View' : 'বাংলায় দেখুন'}
             </button>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">সহীহ হাদিস ও ইসলামী বাণী</h1>
          <p className="text-lg text-white/70">শুদ্ধ আমল ও সঠিক আকীদার আলোকে পবিত্র কুরআন ও সুন্নাহর কিছু নির্বাচিত বাণী</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {hadithData.map((h, i) => (
            <div key={i} className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-gray-100 flex flex-col justify-between hover:shadow-2xl transition-all duration-500 group">
              <div>
                <div className="flex justify-between items-center mb-10">
                   <span className="bg-primary/5 text-primary text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest border border-primary/10">{h.category}</span>
                   <i className="fas fa-quote-right text-3xl text-primary/10 group-hover:scale-125 transition-transform"></i>
                </div>
                <p className="text-2xl font-medium text-gray-800 leading-relaxed italic mb-10">
                  {lang === 'bn' ? h.bn : h.en}
                </p>
              </div>
              <div className="flex items-center gap-4 border-t border-gray-50 pt-8">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-primary shadow-lg">
                  <i className="fas fa-book-open"></i>
                </div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">{h.ref}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-primary/5 rounded-[4rem] p-12 md:p-20 text-center border border-primary/10">
           <i className="fas fa-quran text-5xl text-primary/30 mb-8"></i>
           <h2 className="text-3xl font-black text-gray-800 mb-8 tracking-tighter">“তোমরা যা ভালোবাসো তা থেকে আল্লাহর পথে ব্যয় না করা পর্যন্ত কখনো পুণ্য লাভ করতে পারবে না।”</h2>
           <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">— সূরা আল-ইমরান (৩:৯২)</p>
        </div>
      </div>
    </div>
  );
};

export default HadithPage;
