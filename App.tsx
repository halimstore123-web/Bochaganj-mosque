
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import DonationPage from './pages/DonationPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminAccounting from './pages/AdminAccounting';
import AdminDonations from './pages/AdminDonations';
import AdminManualPayment from './pages/AdminManualPayment';
import AdminPosControl from './pages/AdminPosControl';
import AdminReports from './pages/AdminReports';
import AdminAuditLogs from './pages/AdminAuditLogs';
import AdminSettings from './pages/AdminSettings';
import AdminReceipts from './pages/AdminReceipts';
import AdminLogin from './pages/AdminLogin';
import About from './pages/About';
import HadithPage from './pages/HadithPage';
import DonationSearchPage from './pages/DonationSearchPage';
import PrayerTimes from './pages/PrayerTimes';
import Notices from './pages/Notices';
import Committee from './pages/Committee';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Transparency from './pages/Transparency';
import PosDashboard from './pages/PosDashboard';
import PosLogin from './pages/PosLogin';
import Login from './pages/Login';
import { User, UserRole } from './types';

// FIX: Ensure children is passed correctly
const AdminGuard: React.FC<{ children: React.ReactNode, user: User | null }> = ({ children, user }) => {
  const isAdmin = user?.role === UserRole.ADMIN;
  const hasToken = !!localStorage.getItem('auth_token');
  if (!isAdmin || !hasToken) return <Navigate to="/admin/login" replace />;
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
        if (parsed.role === UserRole.ADMIN && !hasToken) handleLogout();
        else setCurrentUser(parsed);
      } catch (e) { handleLogout(); }
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

  const isFullPage = ['/admin/login', '/pos', '/pos-login'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf9]">
      {!isFullPage && <Navbar user={currentUser} onLogout={handleLogout} />}
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
          <Route path="/pos-login" element={<PosLogin onLogin={handleLogin} />} />
          <Route path="/dashboard" element={currentUser ? <UserDashboard user={currentUser} /> : <Navigate to="/login" />} />
          
          {/* Admin Protected Suite */}
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

          <Route path="/pos" element={(currentUser?.role === UserRole.POS || currentUser?.role === UserRole.ADMIN) ? <PosDashboard user={currentUser!} onLogout={handleLogout} /> : <Navigate to="/pos-login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!isFullPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
