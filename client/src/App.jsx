import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import RolesPage from './pages/RolesPage';
import CompaniesPage from './pages/CompaniesPage';
import ResourcesPage from './pages/ResourcesPage';
import ContactPage from './pages/ContactPage';
import TestimonialsPage from './pages/TestimonialsPage';
import BlogPage from './pages/BlogPage';
import FaqsPage from './pages/FaqsPage';
import CareerTipsPage from './pages/CareerTipsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
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
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/faqs" element={<FaqsPage />} />
        <Route path="/career-tips" element={<CareerTipsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
