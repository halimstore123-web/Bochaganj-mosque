
import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="animate-fadeIn font-sans bg-gray-50 pb-24">
      <section className="bg-primary py-24 px-6 text-center text-white relative mosque-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">যোগাযোগ করুন</h1>
          <p className="text-lg text-white/70">যেকোনো প্রশ্ন বা পরামর্শের জন্য আমাদের মেসেজ দিন</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-20 grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100">
            <h3 className="text-xl font-black text-gray-800 mb-8 border-b border-gray-50 pb-4 uppercase tracking-widest">মসজিদ অফিস</h3>
            <div className="space-y-6">
              <ContactInfo icon="fa-map-marker-alt" title="ঠিকানা" text="বোচাগঞ্জ, দিনাজপুর, বাংলাদেশ" />
              <ContactInfo icon="fa-phone-alt" title="ফোন" text="+৮৮০ ১৭XXXXXXXX" />
              <ContactInfo icon="fa-envelope" title="ইমেইল" text="info@bochaganjmosque.org" />
            </div>
          </div>
          <div className="bg-accent p-10 rounded-[3rem] text-primary shadow-xl relative overflow-hidden">
             <div className="mosque-pattern absolute inset-0 opacity-10"></div>
             <div className="relative z-10 text-center">
                <i className="fas fa-clock text-4xl mb-4"></i>
                <h4 className="font-black text-lg uppercase tracking-widest mb-2">অফিস সময়</h4>
                <p className="font-bold">প্রতিদিন: বাদ যোহর - মাগরিব পর্যন্ত</p>
             </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white p-10 md:p-16 rounded-[4rem] shadow-2xl border border-gray-100 relative">
            {sent ? (
              <div className="py-20 text-center animate-scaleIn">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                  <i className="fas fa-check"></i>
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">মেসেজ পাঠানো হয়েছে!</h3>
                <p className="text-gray-500">আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব। জাযাকাল্লাহু খাইরান।</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormGroup label="আপনার নাম" placeholder="নাম লিখুন" />
                  <FormGroup label="ফোন নম্বর" placeholder="০১XXXXXXXXX" type="tel" />
                </div>
                <FormGroup label="বিষয়" placeholder="মেসেজের বিষয়" />
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-3 ml-4 tracking-widest">বিস্তারিত মেসেজ</label>
                  <textarea required rows={5} className="w-full px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[2rem] focus:border-primary outline-none transition-all font-bold shadow-inner" placeholder="আপনার মেসেজ এখানে লিখুন..."></textarea>
                </div>
                <button type="submit" className="w-full py-6 bg-primary text-white rounded-[2.5rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-secondary transition-all active:scale-95 border-b-8 border-emerald-950">
                  মেসেজ পাঠান
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactInfo = ({ icon, title, text }: any) => (
  <div className="flex gap-6 items-start group">
    <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
      <i className={`fas ${icon}`}></i>
    </div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="font-bold text-gray-700">{text}</p>
    </div>
  </div>
);

const FormGroup = ({ label, placeholder, type = "text" }: any) => (
  <div>
    <label className="block text-[10px] font-black text-gray-400 uppercase mb-3 ml-4 tracking-widest">{label}</label>
    <input 
      type={type} 
      required
      className="w-full px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[2rem] focus:border-primary outline-none transition-all font-bold shadow-inner"
      placeholder={placeholder}
    />
  </div>
);

export default Contact;
