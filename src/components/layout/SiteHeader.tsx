import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Lock } from 'lucide-react';
import { Button } from '../ui/Button';

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
    <header className="sticky top-0 z-40 bg-[#FBFBF9]/90 backdrop-blur-md border-b border-[#E5E3DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-[#141413] hover:opacity-90 transition-opacity focus-visible:outline-2 rounded-lg"
          >
            <div className="w-8 h-8 rounded-lg bg-[#141413] flex items-center justify-center text-white font-bold text-sm shadow-xs">
              <span className="text-[#C85A32]">L</span>
            </div>
            <span className="font-bold text-lg tracking-tight font-editorial-heading">Lyberate</span>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                    isActive
                      ? 'text-[#C85A32] bg-[#F5F4EF]'
                      : 'text-[#5C5B56] hover:text-[#141413] hover:bg-[#F5F4EF]'
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
              className="text-[#8A8881] hover:text-[#141413] p-2 rounded-lg transition-colors text-xs font-medium flex items-center gap-1"
              title="Control Room"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="sr-only">Acceso privado</span>
            </Link>

            <Link to="/contacto">
              <Button size="sm" variant="primary">
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
                  `px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                    isActive
                      ? 'text-[#C85A32] bg-[#F5F4EF]'
                      : 'text-[#5C5B56] hover:text-[#141413] hover:bg-[#F5F4EF]'
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

