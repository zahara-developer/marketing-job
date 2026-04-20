import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import LogoLoader from './components/LogoLoader';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import RolesPage from './pages/RolesPage';
import CompaniesPage from './pages/CompaniesPage';
import CommunityPage from './pages/CommunityPage';
import CommunityDiscussionPage from './pages/CommunityDiscussionPage';
import ResourcesPage from './pages/ResourcesPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ContactPage from './pages/ContactPage';
import ApplyPage from './pages/ApplyPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import TestimonialsPage from './pages/TestimonialsPage';
import BlogPage from './pages/BlogPage';
import FaqsPage from './pages/FaqsPage';
import CareerTipsPage from './pages/CareerTipsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ApplicationsPage from './pages/ApplicationsPage';
import SavedJobsPage from './pages/SavedJobsPage';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setShowLoader(false);
    }, 2000);

    return () => window.clearTimeout(timerId);
  }, []);

  if (showLoader) {
    return <LogoLoader />;
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/roles"
            element={(
              <ProtectedRoute>
                <RolesPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/companies"
            element={(
              <ProtectedRoute>
                <CompaniesPage />
              </ProtectedRoute>
            )}
          />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/:slug" element={<CommunityDiscussionPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
          <Route
            path="/resources"
            element={(
              <ProtectedRoute>
                <ResourcesPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/apply"
            element={(
              <ProtectedRoute>
                <ApplyPage />
              </ProtectedRoute>
            )}
          />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/profile"
            element={(
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/applications"
            element={(
              <ProtectedRoute>
                <ApplicationsPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/saved-jobs"
            element={(
              <ProtectedRoute>
                <SavedJobsPage />
              </ProtectedRoute>
            )}
          />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/faqs" element={<FaqsPage />} />
          <Route path="/career-tips" element={<CareerTipsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
