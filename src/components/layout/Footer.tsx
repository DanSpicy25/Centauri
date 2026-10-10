import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#141413] text-[#F5F4EF] border-t border-[#2A2926]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#C85A32] flex items-center justify-center text-white font-bold text-xs">
                L
              </div>
              <span className="font-bold text-xl tracking-tight text-white font-editorial-heading">
                Lyberate
              </span>
            </div>
            <p className="text-xs text-[#8A8881] max-w-sm leading-relaxed">
              Plataforma digital de desarrollo de software, productos tecnológicos y arquitectura de sistemas. Creamos soluciones con criterio propio, diseño editorial y código sólido.
            </p>
            <div className="pt-2 text-[11px] text-[#8A8881]">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2" aria-hidden="true" />
              Sistemas y operaciones en línea
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Navegación</h4>
            <ul className="space-y-2 text-xs text-[#8A8881]">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
              </li>
              <li>
                <Link to="/sobre-nosotros" className="hover:text-white transition-colors">Sobre nosotros</Link>
              </li>
              <li>
                <Link to="/servicios" className="hover:text-white transition-colors">Servicios</Link>
              </li>
              <li>
                <Link to="/productos" className="hover:text-white transition-colors">Productos</Link>
              </li>
              <li>
                <Link to="/trabajos" className="hover:text-white transition-colors">Trabajos y Portafolio</Link>
              </li>
            </ul>
          </div>

          {/* Contact and Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Contacto & Acceso</h4>
            <ul className="space-y-2 text-xs text-[#8A8881]">
              <li>
                <Link to="/contacto" className="hover:text-white transition-colors">Formulario de contacto</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">Control Room (Privado)</Link>
              </li>
              <li className="pt-2 text-[11px] text-[#5C5B56]">
                Propiedad intelectual y marca pública registrada.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#2A2926] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A8881]">
          <p>© {new Date().getFullYear()} Lyberate. Todos los derechos reservados.</p>
          <p className="text-[11px]">
            Construido con React 19, TypeScript y Tailwind CSS sobre arquitectura Centauri.
          </p>
        </div>
      </div>
    </footer>
  );
};

