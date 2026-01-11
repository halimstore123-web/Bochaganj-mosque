
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="animate-fadeIn font-sans bg-gray-50">
      <section className="bg-primary pt-24 pb-48 px-6 mosque-pattern relative overflow-hidden text-center text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 to-primary"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">মসজিদ পরিচিতি</h1>
          <p className="text-xl text-white/80 font-medium">বোচাগঞ্জ আহলে হাদীস কেন্দ্রীয় জামে মসজিদ - একটি ঐতিহ্যের ধারক</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto -mt-24 px-4 pb-24 relative z-20">
        <div className="bg-white rounded-[3rem] shadow-2xl p-10 md:p-16 border border-gray-100">
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <h2 className="text-3xl font-black text-gray-800 mb-8 border-b border-primary/10 pb-4">আমাদের ইতিহাস</h2>
            <p className="mb-6">
              বোচাগঞ্জ আহলে হাদীস কেন্দ্রীয় জামে মসজিদ দিনাজপুরের বোচাগঞ্জ উপজেলায় অবস্থিত একটি স্বনামধন্য ধর্মীয় প্রতিষ্ঠান। ১৯৭৯ সালে প্রতিষ্ঠার পর থেকে এই মসজিদটি অত্র অঞ্চলের মুসলিমদের সঠিক আকীদা ও আমল প্রচারের অন্যতম কেন্দ্র হিসেবে কাজ করে আসছে।
            </p>
            <p className="mb-8">
              মসজিদটি শুধুমাত্র নামাজ আদায়ের কেন্দ্র নয়, বরং এটি একটি শিক্ষা ও সেবা প্রতিষ্ঠান। এখানে কুরআন তিলাওয়াত, হিফজ এবং দ্বীনি শিক্ষা প্রদানের ব্যবস্থা রয়েছে। মসজিদের নিজস্ব ব্যবস্থাপনায় বিভিন্ন সামাজিক ও কল্যাণমূলক কাজ পরিচালিত হয়।
            </p>

            <h2 className="text-3xl font-black text-gray-800 mb-8 border-b border-primary/10 pb-4">আমাদের লক্ষ্য ও উদ্দেশ্য</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                 <h4 className="font-black text-primary text-xl mb-4">শুদ্ধ আকীদা প্রচার</h4>
                 <p className="text-sm">কুরআন ও সহীহ সুন্নাহর আলোকে শুদ্ধ ইসলামী শিক্ষা ও আকীদা সর্বসাধারণের মাঝে পৌঁছে দেওয়া আমাদের মূল লক্ষ্য।</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                 <h4 className="font-black text-primary text-xl mb-4">সামাজিক উন্নয়ন</h4>
                 <p className="text-sm">দরিদ্র ও অসহায় মানুষের পাশে দাঁড়ানো এবং সমাজের প্রতিটি স্তরে ন্যায়ের শাসন ও ইসলামী ভ্রাতৃত্ব প্রতিষ্ঠা করা।</p>
              </div>
            </div>

            <div className="bg-primary/5 p-12 rounded-[3rem] border border-primary/10 text-center">
               <h3 className="text-2xl font-black text-primary mb-6">মসজিদ কমিটি ও পরিচালনা</h3>
               <p className="mb-6">অত্যন্ত দক্ষতার সাথে একটি নির্বাচিত কমিটির মাধ্যমে মসজিদের সকল কার্যক্রম পরিচালিত হয়। আমরা সবসময় স্বচ্ছতা ও জবাবদিহিতায় বিশ্বাসী।</p>
               <div className="flex flex-wrap justify-center gap-4">
                  <span className="bg-white px-6 py-2 rounded-full text-xs font-bold text-gray-500 shadow-sm border border-gray-100 uppercase tracking-widest">ESTD 1979</span>
                  <span className="bg-white px-6 py-2 rounded-full text-xs font-bold text-gray-500 shadow-sm border border-gray-100 uppercase tracking-widest">CENTRAL JAME MOSQUE</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
