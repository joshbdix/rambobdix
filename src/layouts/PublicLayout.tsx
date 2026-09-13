import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { AnnouncementBar } from '../components/public/AnnouncementBar';
import { Navbar } from '../components/public/Navbar';
import { Footer } from '../components/public/Footer';
import { FloatingContact } from '../components/public/FloatingContact';
import { ToastContainer } from '../components/common/ToastContainer';

export const PublicLayout: React.FC = () => {
  const { effectiveTheme } = useTheme();

  return (
    <div 
      className="min-h-screen flex flex-col transition-colors duration-300"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
      }}
    >
      {effectiveTheme.announcement_enabled && <AnnouncementBar />}
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
      {effectiveTheme.floating_contact_enabled && <FloatingContact />}
      <ToastContainer />
    </div>
  );
};
