import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { SiteHeader } from './SiteHeader';
import { Footer } from './Footer';
import { FloatingContactWidget } from '../common/FloatingContactWidget';

export const PublicLayout: React.FC = () => {
  const mainRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    const elements = [...main.querySelectorAll<HTMLElement>('[data-reveal]')];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.setAttribute('data-visible', 'true'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute('data-visible', 'true');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    );

    elements.forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 90}ms`);
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-[#141413]">
      <SiteHeader />
      <main ref={mainRef} className="page-enter flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingContactWidget />
    </div>
  );
};
