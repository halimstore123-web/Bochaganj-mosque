
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Home from './Home';
import DonationPage from './DonationPage';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import AdminUsers from './AdminUsers';
import AdminAccounting from './AdminAccounting';
import AdminDonations from './AdminDonations';
import AdminManualPayment from './AdminManualPayment';
import AdminPosControl from './AdminPosControl';
import AdminReports from './AdminReports';
import AdminAuditLogs from './AdminAuditLogs';
import AdminSettings from './AdminSettings';
import AdminReceipts from './AdminReceipts';
import AdminLogin from './AdminLogin';
import About from './About';
import HadithPage from './HadithPage';
import DonationSearchPage from './DonationSearchPage';
import PrayerTimes from './PrayerTimes';
import Notices from './Notices';
import Committee from './Committee';
import Gallery from './Gallery';
import Contact from './Contact';
import Transparency from './Transparency';
import PosDashboard from './PosDashboard';
import PosLogin from './PosLogin';
import Login from './Login';
import { User, UserRole } from '../types';

/**
 * Strict Security Guard for Admin Routes
 */
const AdminGuard: React.FC<{ children: React.ReactNode, user: User | null }> = ({ children, user }) => {
  const isAdmin = user?.role === UserRole.ADMIN;
  const hasToken = !!localStorage.getItem('auth_token');
  if (!isAdmin || !hasToken) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

/**
 * Strict Security Guard for POS Terminal
 */
const PosGuard: React.FC<{ children: React.ReactNode, user: User | null }> = ({ children, user }) => {
  const isPosOrAdmin = user?.role === UserRole.POS || user?.role === UserRole.ADMIN;
  if (!isPosOrAdmin) return <Navigate to="/pos/login" replace />;
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem('logged_user');
    const hasToken = !!localStorage.getItem('auth_token');
    
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === UserRole.ADMIN && !hasToken) {
           handleLogout();
        } else {
           setCurrentUser(parsed);
        }
      } catch (e) {
        handleLogout();
      }
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('logged_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('logged_user');
    localStorage.removeItem('auth_token');
  };

  const isIsolatedPage = location.pathname.startsWith('/pos') || location.pathname === '/admin/login';

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf9]">
      {!isIsolatedPage && <Navbar user={currentUser} onLogout={handleLogout} />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/hadith" element={<HadithPage />} />
          <Route path="/search" element={<DonationSearchPage />} />
          <Route path="/donate" element={<DonationPage user={currentUser} />} />
          <Route path="/prayer-times" element={<PrayerTimes />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/committee" element={<Committee />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/transparency" element={<Transparency />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          
          <Route path="/admin/login" element={<AdminLogin onLogin={handleLogin} />} />
          <Route path="/pos/login" element={<PosLogin onLogin={handleLogin} />} />
          
          <Route path="/dashboard" element={
            currentUser ? <UserDashboard user={currentUser} /> : <Navigate to="/login" />
          } />

          {/* Master Admin Suite */}
          <Route path="/admin" element={<AdminGuard user={currentUser}><AdminDashboard /></AdminGuard>} />
          <Route path="/admin/users" element={<AdminGuard user={currentUser}><AdminUsers /></AdminGuard>} />
          <Route path="/admin/accounting" element={<AdminGuard user={currentUser}><AdminAccounting /></AdminGuard>} />
          <Route path="/admin/donations" element={<AdminGuard user={currentUser}><AdminDonations /></AdminGuard>} />
          <Route path="/admin/manual-payment" element={<AdminGuard user={currentUser}><AdminManualPayment /></AdminGuard>} />
          <Route path="/admin/pos-control" element={<AdminGuard user={currentUser}><AdminPosControl /></AdminGuard>} />
          <Route path="/admin/reports" element={<AdminGuard user={currentUser}><AdminReports /></AdminGuard>} />
          <Route path="/admin/audit-logs" element={<AdminGuard user={currentUser}><AdminAuditLogs /></AdminGuard>} />
          <Route path="/admin/settings" element={<AdminGuard user={currentUser}><AdminSettings /></AdminGuard>} />
          <Route path="/admin/receipts" element={<AdminGuard user={currentUser}><AdminReceipts /></AdminGuard>} />

          {/* POS Terminal */}
          <Route path="/pos" element={<PosGuard user={currentUser}><PosDashboard user={currentUser!} onLogout={handleLogout} /></PosGuard>} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!isIsolatedPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
