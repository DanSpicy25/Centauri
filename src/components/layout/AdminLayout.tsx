import React, { useState } from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  FileText,
  Globe,
  Users,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Search,
  Send,
  User,
  Rocket,
} from 'lucide-react';
import { Badge } from '../ui/Badge';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  disabled?: boolean;
}

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems: NavItem[] = [
    { label: 'Resumen Operativo', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Sistema de Diseño', path: '/admin/design-system', icon: Layers },
    { label: 'CMS Editorial (F04)', path: '/admin/cms', icon: FileText },
    { label: 'Portafolio Casos (F04)', path: '/admin/cms/proyectos', icon: Layers },
    { label: 'Sitios Gestionados (F05)', path: '/admin/sitios', icon: Globe },
    { label: 'Clientes & CRM (F06)', path: '/admin/crm', icon: Users },
    { label: 'Finanzas & Planes (F07)', path: '/admin/finanzas', icon: CreditCard },
    { label: 'Mensajería & Despacho', path: '/admin/automatizaciones', icon: Send },
    { label: 'Perfil & Full-Stack', path: '/admin/perfil', icon: User },
    { label: 'Configuración & RBAC (F08)', path: '/admin/configuracion', icon: Settings },
    { label: 'Lanzamiento & Salud (F09)', path: '/admin/lanzamiento', icon: Rocket },
  ];

  return (
    <div className="min-h-screen flex bg-[#F5F4EF] text-[#141413]">
      {/* Sidebar */}
      <aside
        className={`bg-[#141413] text-[#F5F4EF] border-r border-[#2A2926] transition-all duration-200 flex flex-col justify-between shrink-0
          ${collapsed ? 'w-16' : 'w-64'}`}
      >
        <div>
          {/* Header Branding */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-[#2A2926]">
            {!collapsed && (
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-6 h-6 rounded bg-[#C85A32] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  L
                </div>
                <div className="truncate">
                  <span className="font-bold text-sm text-white block truncate leading-none">Lyberate</span>
                  <span className="text-[10px] text-[#8A8881] font-mono tracking-wider uppercase">Control Room</span>
                </div>
              </div>
            )}
            {collapsed && (
              <div className="w-8 h-8 rounded bg-[#C85A32] mx-auto flex items-center justify-center text-white text-sm font-bold">
                L
              </div>
            )}
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="text-[#8A8881] hover:text-white p-1 rounded transition-colors hidden sm:block cursor-pointer"
              aria-label={collapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-2 space-y-1" aria-label="Navegación del panel administrativo">
            {navItems.map((item) => {
              const Icon = item.icon;
              if (item.disabled) {
                return (
                  <div
                    key={item.label}
                    className={`flex items-center gap-3 px-3 py-2 text-xs rounded-lg text-[#5C5B56] cursor-not-allowed select-none
                      ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? `${item.label} (Próximamente)` : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0 opacity-60" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#C85A32] text-white font-semibold shadow-xs'
                        : 'text-[#8A8881] hover:bg-[#2A2926] hover:text-white'
                    } ${collapsed ? 'justify-center' : ''}`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-3 border-t border-[#2A2926]">
          <Link
            to="/"
            className={`flex items-center gap-2.5 px-3 py-2 text-xs text-[#8A8881] hover:text-white hover:bg-[#2A2926] rounded-lg transition-colors
              ${collapsed ? 'justify-center' : ''}`}
            title="Ir al sitio web público"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Ver web pública</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-[#E5E3DC] px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8881]" />
              <input
                type="text"
                placeholder="Buscar recursos..."
                aria-label="Buscar recursos en el panel"
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F5F4EF] rounded-lg border-none focus:outline-2 focus:outline-[#C85A32]"
              />
            </div>
            <Badge variant="brand" size="sm">
              Fase 01: Fundaciones
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-[#5C5B56]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">Modo: Entorno Seguro Local</span>
            </div>

            <div className="flex items-center gap-2 pl-4 border-l border-[#E5E3DC]">
              <div className="w-8 h-8 rounded-full bg-[#141413] text-white flex items-center justify-center text-xs font-bold avatar-brand-ring">
                AD
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-semibold text-[#141413] block leading-none">Administrador</span>
                <span className="text-[10px] text-[#8A8881] leading-none">Rol de Auditoría</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

