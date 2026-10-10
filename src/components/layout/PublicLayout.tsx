import React from 'react';
import { Outlet } from 'react-router-dom';
import { SiteHeader } from './SiteHeader';
import { Footer } from './Footer';
import { FloatingContactWidget } from '../common/FloatingContactWidget';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-[#141413]">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingContactWidget />
    </div>
  );
};

