
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setIsOpen(false);
  };

  const MenuLink = ({ to, children, icon }: { to: string, children?: React.ReactNode, icon: string }) => (
    <Link to={to} onClick={() => setIsOpen(false)} className="flex items-center px-4 py-3 text-white hover:bg-secondary transition-colors">
      <i className={`fas ${icon} w-6`}></i>
      <span className="ml-2 font-bold">{children}</span>
    </Link>
  );

  return (
    <>
      <nav className="bg-primary text-white shadow-md sticky top-0 z-50 transition-all no-print">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-white p-1 rounded-full"><i className="fas fa-mosque text-primary text-xl"></i></div>
            <span className="font-black text-xs md:text-sm uppercase tracking-tighter leading-none">Bochaganj Mosque<br/><span className="text-accent">Portal</span></span>
          </Link>
          <div className="hidden xl:flex items-center space-x-4 text-[12px] font-black uppercase tracking-tighter">
            <Link to="/" className="hover:text-accent">হোম</Link>
            <Link to="/prayer-times" className="hover:text-accent">নামাজ</Link>
            <Link to="/notices" className="hover:text-accent">নোটিশ</Link>
            <Link to="/committee" className="hover:text-accent">কমিটি</Link>
            <Link to="/gallery" className="hover:text-accent">গ্যালারি</Link>
            <Link to="/search" className="hover:text-accent">অনুসন্ধান</Link>
            <Link to="/contact" className="hover:text-accent">যোগাযোগ</Link>
            <Link to="/donate" className="bg-accent text-primary px-4 py-1.5 rounded-full">দান করুন</Link>
            {user ? (
              <div className="flex items-center space-x-3 ml-2 pl-4 border-l border-white/20">
                {user.role === UserRole.ADMIN && <Link to="/admin" className="text-accent">এডমিন</Link>}
                {user.role === UserRole.POS && <Link to="/pos" className="text-accent">পিওএস</Link>}
                <Link to="/dashboard" className="bg-white/10 px-3 py-1 rounded-lg">ড্যাশবোর্ড</Link>
                <button onClick={handleLogout} className="text-red-300"><i className="fas fa-power-off"></i></button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="bg-white/20 px-6 py-1.5 rounded-full ml-2">লগইন</Link>
                <div className="h-4 w-px bg-white/10"></div>
                {/* UPDATED ADMIN PATH */}
                <Link to="/admin/login" className="text-[9px] opacity-40 hover:opacity-100">ADMIN</Link>
              </div>
            )}
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="xl:hidden text-2xl"><i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i></button>
        </div>
      </nav>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] xl:hidden" onClick={() => setIsOpen(false)}>
          <div className="bg-primary w-72 h-full shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-white font-black uppercase tracking-widest text-xs">Menu</h2>
              <button onClick={() => setIsOpen(false)} className="text-white/50"><i className="fas fa-times"></i></button>
            </div>
            <div className="flex-grow py-4 overflow-y-auto">
              <MenuLink to="/" icon="fa-home">হোম</MenuLink>
              <MenuLink to="/prayer-times" icon="fa-clock">নামাজ</MenuLink>
              <MenuLink to="/notices" icon="fa-bullhorn">নোটিশ</MenuLink>
              <MenuLink to="/committee" icon="fa-users">কমিটি</MenuLink>
              <MenuLink to="/gallery" icon="fa-images">গ্যালারি</MenuLink>
              <MenuLink to="/search" icon="fa-search">অনুসন্ধান</MenuLink>
              <MenuLink to="/contact" icon="fa-envelope">যোগাযোগ</MenuLink>
              <div className="p-4"><Link to="/donate" onClick={() => setIsOpen(false)} className="block w-full bg-accent text-primary text-center font-black py-4 rounded-2xl">দান করুন</Link></div>
              <div className="mt-4 pt-4 border-t border-white/10">
                {user ? (
                  <>
                    <MenuLink to="/dashboard" icon="fa-user-circle">ড্যাশবোর্ড</MenuLink>
                    {user.role === UserRole.ADMIN && <MenuLink to="/admin" icon="fa-user-shield">এডমিন</MenuLink>}
                    {user.role === UserRole.POS && <MenuLink to="/pos" icon="fa-cash-register">পিওএস</MenuLink>}
                    <button onClick={handleLogout} className="flex items-center px-4 py-4 text-red-300 w-full text-left font-black"><i className="fas fa-sign-out-alt w-6"></i>লগআউট</button>
                  </>
                ) : (
                  <div className="p-4 pt-0 space-y-2">
                    <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full bg-white/10 text-white text-center font-black py-4 rounded-2xl">সদস্য লগইন</Link>
                    {/* UPDATED ADMIN PATH */}
                    <Link to="/admin/login" onClick={() => setIsOpen(false)} className="block w-full text-white/40 text-center font-black py-2 rounded-2xl text-[10px] uppercase">Master Vault</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
