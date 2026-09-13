import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';

// Public Layout & Pages
import { PublicLayout } from './layouts/PublicLayout';
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { PackagesPage } from './pages/public/PackagesPage';
import { FAQPage } from './pages/public/FAQPage';
import { ContactPage } from './pages/public/ContactPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Admin Layout, Guard & Pages
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardOverview } from './pages/admin/AdminDashboardOverview';
import { AdminPackagesPage } from './pages/admin/AdminPackagesPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminFAQsPage } from './pages/admin/AdminFAQsPage';
import { AdminAnnouncementsPage } from './pages/admin/AdminAnnouncementsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminContactsPage } from './pages/admin/AdminContactsPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';
import { AdminManagementPage } from './pages/admin/AdminManagementPage';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';
import { UnauthorizedPage } from './pages/admin/UnauthorizedPage';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <DataProvider>
          <HashRouter>
            <Routes>
            {/* Public Facing Website Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="packages" element={<PackagesPage />} />
              <Route path="faq" element={<FAQPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin Authentication & Security Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/unauthorized" element={<Navigate to="/403" replace />} />
            <Route path="/403" element={<UnauthorizedPage />} />

            {/* Admin Dashboard Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboardOverview />} />
              <Route path="packages" element={<AdminPackagesPage />} />
              <Route path="services" element={<AdminServicesPage />} />
              <Route path="faqs" element={<AdminFAQsPage />} />
              <Route path="announcements" element={<AdminAnnouncementsPage />} />
              <Route
                path="settings"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminSettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="contacts"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminContactsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="audit-logs"
                element={
                  <ProtectedRoute requireSuperAdmin={true}>
                    <AdminAuditLogsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admins"
                element={
                  <ProtectedRoute requireSuperAdmin={true}>
                    <AdminManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route path="team" element={<Navigate to="/admin/admins" replace />} />
              <Route path="profile" element={<AdminProfilePage />} />
            </Route>
          </Routes>
        </HashRouter>
      </DataProvider>
    </ThemeProvider>
  </AuthProvider>
  );
}
