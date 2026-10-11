import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Lock } from 'lucide-react';
import { Button } from '../ui/Button';
import { LyberateLogo } from '../common/LyberateLogo';

export const SiteHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Inicio', path: '/' },
    { label: 'Sobre nosotros', path: '/sobre-nosotros' },
    { label: 'Servicios', path: '/servicios' },
    { label: 'Productos', path: '/productos' },
    { label: 'Trabajos', path: '/trabajos' },
    { label: 'Contacto', path: '/contacto' },
  ];

  return (
    <header className="site-header sticky top-0 z-40 border-b border-white/60 bg-[#FBFBF9]/80 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <Link
            to="/"
            className="site-brand flex items-center hover:opacity-95 transition-opacity focus-visible:outline-2 rounded-xl"
            aria-label="Ir a inicio de Lyberate"
          >
            <LyberateLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `site-link px-3.5 py-2 text-xs font-semibold rounded-full border border-transparent ${
                    isActive
                      ? 'text-[#141413] bg-white border-[#E5E3DC] shadow-sm'
                      : 'text-[#5C5B56] hover:text-[#141413] hover:bg-white/70 hover:border-[#E5E3DC]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Header Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Discreet Admin Link */}
            <Link
              to="/admin"
              aria-label="Acceso privado al panel de control"
              className="site-admin-link site-link text-[#8A8881] hover:text-[#141413] p-2 rounded-lg text-xs font-medium flex items-center gap-1"
              title="Control Room"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="sr-only">Acceso privado</span>
            </Link>

            <Link to="/contacto">
              <Button size="sm" variant="primary" className="btn-press">
                Iniciar conversación
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Cerrar menú principal' : 'Abrir menú principal'}
              className="p-2 rounded-lg text-[#141413] hover:bg-[#F5F4EF] focus-visible:outline-2 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E5E3DC] bg-[#FBFBF9] px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <nav aria-label="Navegación móvil" className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `site-link px-4 py-3 text-sm font-semibold rounded-2xl border border-transparent ${
                    isActive
                      ? 'text-[#141413] bg-white border-[#E5E3DC] shadow-sm'
                      : 'text-[#5C5B56] hover:text-[#141413] hover:bg-white/70 hover:border-[#E5E3DC]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="pt-4 border-t border-[#E5E3DC] flex flex-col gap-2.5">
            <Link to="/contacto" onClick={() => setMobileMenuOpen(false)}>
              <Button size="md" variant="primary" className="w-full justify-center">
                Iniciar conversación
              </Button>
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 py-2 text-xs text-[#8A8881] hover:text-[#141413]"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Acceso privado administrativo</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
