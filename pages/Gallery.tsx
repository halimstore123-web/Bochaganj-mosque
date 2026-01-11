
import React from 'react';

const Gallery: React.FC = () => {
  const images = [
    { title: 'মসজিদ সম্মুখভাগ', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800' },
    { title: 'অভ্যন্তরীণ কারুকাজ', url: 'https://images.unsplash.com/photo-1564769625905-50e9363df7c0?auto=format&fit=crop&q=80&w=800' },
    { title: 'পবিত্র জুম্মার নামাজ', url: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d97e?auto=format&fit=crop&q=80&w=800' },
    { title: 'মিনারের দৃশ্য', url: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&q=80&w=800' },
    { title: 'রাতের আলোকসজ্জা', url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=800' },
    { title: 'মসজিদ বাগান', url: 'https://images.unsplash.com/photo-1591122947157-26bad3a117d2?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <div className="animate-fadeIn font-sans bg-gray-50 pb-24">
      <section className="bg-primary py-24 px-6 text-center text-white relative mosque-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase">ফটোগ্যালারী</h1>
          <p className="text-lg text-white/70">আমাদের মসজিদের কিছু চমৎকার মুহূর্ত এবং স্থাপত্যের আলোকচিত্র</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, i) => (
            <div key={i} className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all aspect-square border-4 border-white">
              <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                <p className="text-white font-black text-xl tracking-tighter uppercase">{img.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
