
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8 px-6 relative overflow-hidden mt-auto no-print">
      <div className="mosque-pattern absolute inset-0 opacity-5"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white p-2 rounded-xl shadow-lg">
                <i className="fas fa-mosque text-primary text-xl"></i>
              </div>
              <h2 className="text-xl font-black tracking-tighter uppercase leading-tight">
                Bochaganj Ahle Hadis<br/>
                <span className="text-[10px] font-black text-accent tracking-[0.3em] uppercase">Central Jame Mosque</span>
              </h2>
            </div>
            <p className="text-white/60 text-sm font-medium leading-relaxed max-w-md">
              Establishment: 1979. We are dedicated to providing a transparent and efficient management system for our community. Your donations are the lifeblood of our spiritual and social activities.
            </p>
          </div>
          
          <div>
            <h5 className="text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-6">Quick Links</h5>
            <ul className="space-y-3 font-bold text-xs uppercase tracking-widest text-white/50">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/transparency" className="hover:text-white transition-colors">Transparency</Link></li>
              <li><Link to="/hadith" className="hover:text-white transition-colors">Hadith & Wisdom</Link></li>
              <li><Link to="/search" className="hover:text-white transition-colors">Search Contribution</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-6">Support & Contact</h5>
            <p className="text-xs font-bold text-white/70 mb-2">Bochaganj, Dinajpur, Bangladesh</p>
            <p className="text-xs font-bold text-white/70 mb-4">contact@bochaganjmosque.org</p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all border border-white/10"><i className="fab fa-facebook-f text-xs text-white/40"></i></a>
              <a href="#" className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all border border-white/10"><i className="fab fa-whatsapp text-xs text-white/40"></i></a>
              <a href="#" className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all border border-white/10"><i className="fab fa-youtube text-xs text-white/40"></i></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[9px] font-black uppercase text-white/30 tracking-[0.2em]">
            © 2024 BOCHAGANJ AHLE HADIS CENTRAL JAME MOSQUE. POWERED BY SMART MOSQUE ERP.
          </p>
          <div className="flex gap-4">
            {/* UPDATED ADMIN PATH */}
            <Link to="/admin/login" className="text-[9px] font-black uppercase text-white/20 hover:text-accent transition-colors">Admin Portal</Link>
            <Link to="/pos-login" className="text-[9px] font-black uppercase text-white/20 hover:text-accent transition-colors">POS Terminal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
