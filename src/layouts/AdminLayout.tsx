import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { ToastContainer } from '../components/common/ToastContainer';

export const AdminLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (pathname: string) => {
    if (pathname.includes('/packages')) return 'Package Management';
    if (pathname.includes('/services')) return 'Service Management';
    if (pathname.includes('/faqs')) return 'FAQ Management';
    if (pathname.includes('/announcements')) return 'Announcements System';
    if (pathname.includes('/settings')) return 'Website Settings';
    if (pathname.includes('/contacts')) return 'Contact Channels';
    if (pathname.includes('/audit-logs')) return 'Admin Audit Logs';
    if (pathname.includes('/team')) return 'Admin Team Access';
    if (pathname.includes('/profile')) return 'Admin Profile';
    return 'Dashboard Overview';
  };

  return (
    <div className="min-h-screen bg-[#040813] text-slate-100 flex flex-row">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block h-screen sticky top-0 shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-64 h-full z-10 animate-in slide-in-from-left duration-200">
            <AdminSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <AdminHeader
          title={getPageTitle(location.pathname)}
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};
