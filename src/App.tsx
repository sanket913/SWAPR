import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Layout/Header';
import LandingPage from './components/Home/LandingPage';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import BrowsePage from './components/Browse/BrowsePage';
import ProfilePage from './components/Profile/ProfilePage';
import SwapsPage from './components/Swaps/SwapsPage';
import NotificationsPage from './components/Notifications/NotificationsPage';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminUsersPage from './components/Admin/AdminUsersPage';
import AdminSwapsPage from './components/Admin/AdminSwapsPage';
import AdminReportsPage from './components/Admin/AdminReportsPage';
import AdminAnnouncementsPage from './components/Admin/AdminAnnouncementsPage';
import UserProfileModal from './components/UserProfile/UserProfileModal';
import { useUsers } from './hooks/useData';

type Page = 'home' | 'login' | 'register' | 'browse' | 'profile' | 'swaps' | 'notifications' | 
            'admin-dashboard' | 'admin-users' | 'admin-swaps' | 'admin-reports' | 'admin-announcements';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showAuthForm, setShowAuthForm] = useState<'login' | 'register' | null>(null);
  const { currentUser } = useAuth();
  const { users } = useUsers();

  const selectedUser = selectedUserId ? users.find(u => u.id === selectedUserId) : null;

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    setSelectedUserId(null);
    // Scroll to top when changing pages
    window.scrollTo(0, 0);
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleGetStarted = () => {
    if (currentUser) {
      setCurrentPage('browse');
    } else {
      setShowAuthForm('register');
      setCurrentPage('register');
    }
  };

  const renderPage = () => {
    if (!currentUser) {
      switch (currentPage) {
        case 'login':
          return <LoginForm onSwitchToRegister={() => setCurrentPage('register')} />;
        case 'register':
          return <RegisterForm onSwitchToLogin={() => setCurrentPage('login')} />;
        default:
          return <LandingPage onGetStarted={handleGetStarted} />;
      }
    }

    // Admin pages
    if (currentUser.isAdmin) {
      switch (currentPage) {
        case 'admin-dashboard':
          return <AdminDashboard onPageChange={handlePageChange} />;
        case 'admin-users':
          return <AdminUsersPage />;
        case 'admin-swaps':
          return <AdminSwapsPage />;
        case 'admin-reports':
          return <AdminReportsPage />;
        case 'admin-announcements':
          return <AdminAnnouncementsPage />;
        default:
          return <AdminDashboard onPageChange={handlePageChange} />;
      }
    }

    // User pages
    switch (currentPage) {
      case 'browse':
        return <BrowsePage onUserSelect={handleUserSelect} />;
      case 'profile':
        return <ProfilePage />;
      case 'swaps':
        return <SwapsPage />;
      case 'notifications':
        return <NotificationsPage />;
      default:
        return <BrowsePage onUserSelect={handleUserSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} onPageChange={handlePageChange} />
      <main>
        {renderPage()}
      </main>

      {/* User Profile Modal */}
      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;