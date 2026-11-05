import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { DemoAccountBar } from './components/DemoAccountBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';

import { ExplorePage } from './pages/ExplorePage';
import { OpportunityDetailPage } from './pages/OpportunityDetailPage';
import { CreateOpportunityPage } from './pages/CreateOpportunityPage';
import { MyOpportunitiesPage } from './pages/MyOpportunitiesPage';
import { ApplicantReviewPage } from './pages/ApplicantReviewPage';
import { MyApplicationsPage } from './pages/MyApplicationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

import { Opportunity } from './types';

const MainApp: React.FC = () => {
  const { user } = useAuth();

  const [currentPage, setCurrentPage] = useState<string>('explore');
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<number | null>(null);

  const handleNavigate = (page: string, params?: any) => {
    if (params?.opportunityId) {
      setSelectedOpportunityId(params.opportunityId);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOpportunity = (opp: Opportunity) => {
    setSelectedOpportunityId(opp.id);
    setCurrentPage('opportunity-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050508] text-slate-100 font-sans selection:bg-amber-500 selection:text-black">
      <DemoAccountBar />
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      <main className="flex-1">
        {currentPage === 'explore' && (
          <ExplorePage
            onSelectOpportunity={handleSelectOpportunity}
            onNavigateToPost={() => handleNavigate(user ? 'create-opportunity' : 'login')}
          />
        )}

        {currentPage === 'opportunity-detail' && selectedOpportunityId && (
          <OpportunityDetailPage
            opportunityId={selectedOpportunityId}
            onBack={() => handleNavigate('explore')}
            onNavigateToReview={(oppId) => {
              setSelectedOpportunityId(oppId);
              setCurrentPage('applicant-review');
            }}
            onNavigateToProfile={() => handleNavigate('profile')}
            onNavigateToLogin={() => handleNavigate('login')}
          />
        )}

        {currentPage === 'create-opportunity' && (
          <CreateOpportunityPage
            onSuccess={(oppId) => {
              setSelectedOpportunityId(oppId);
              setCurrentPage('opportunity-detail');
            }}
            onCancel={() => handleNavigate('explore')}
          />
        )}

        {currentPage === 'my-opportunities' && (
          <MyOpportunitiesPage
            onNavigateToPost={() => handleNavigate('create-opportunity')}
            onNavigateToReview={(oppId) => {
              setSelectedOpportunityId(oppId);
              setCurrentPage('applicant-review');
            }}
            onSelectOpportunity={handleSelectOpportunity}
          />
        )}

        {currentPage === 'applicant-review' && selectedOpportunityId && (
          <ApplicantReviewPage
            opportunityId={selectedOpportunityId}
            onBack={() => handleNavigate('my-opportunities')}
          />
        )}

        {currentPage === 'my-applications' && (
          <MyApplicationsPage
            onSelectOpportunity={handleSelectOpportunity}
            onNavigateToExplore={() => handleNavigate('explore')}
          />
        )}

        {currentPage === 'profile' && <ProfilePage />}

        {currentPage === 'login' && (
          <LoginPage
            onSuccess={() => handleNavigate('explore')}
            onNavigateToRegister={() => handleNavigate('register')}
          />
        )}

        {currentPage === 'register' && (
          <RegisterPage
            onSuccess={() => handleNavigate('profile')}
            onNavigateToLogin={() => handleNavigate('login')}
          />
        )}
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </NotificationProvider>
  );
}
