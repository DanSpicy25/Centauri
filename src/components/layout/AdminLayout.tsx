import React, { useEffect, useState } from 'react';
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
  Menu,
  X,
  Send,
  User,
  Rocket,
  Bell,
  LogOut,
  Briefcase,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { LyberateLogo } from '../common/LyberateLogo';
import { AdminSignIn } from './AdminSignIn';
import { mockBackendRepository } from '../../repositories/mockBackendRepository';
import type { MockAdminSession } from '../../repositories/mockBackendRepository';
import { profileRepository } from '../../repositories/profileRepository';
import type { AdminNotificationDTO } from '../../types/backend';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  disabled?: boolean;
}

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [session, setSession] = useState<MockAdminSession | null>(() => mockBackendRepository.getSession());
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotificationDTO[]>([]);
  const [notificationError, setNotificationError] = useState<string | null>(null);

  const refreshSessionState = () => {
    const current = mockBackendRepository.getSession();
    profileRepository.reloadFromStorage();
    setSession(current);
    setNotifications(current ? mockBackendRepository.getNotifications(current.profileId) : []);
  };

  useEffect(() => {
    refreshSessionState();
    window.addEventListener('storage', refreshSessionState);
    window.addEventListener('lyberate-backend-update', refreshSessionState);
    return () => {
      window.removeEventListener('storage', refreshSessionState);
      window.removeEventListener('lyberate-backend-update', refreshSessionState);
    };
  }, []);

  const navItems: NavItem[] = [
    { label: 'Resumen Operativo', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Proyectos & Entregas', path: '/admin/proyectos', icon: Briefcase },
    { label: 'Clientes y oportunidades', path: '/admin/crm', icon: Users },
    { label: 'Portafolio y Contenido', path: '/admin/cms', icon: FileText },
    { label: 'Catálogo de Trabajos', path: '/admin/cms/proyectos', icon: Layers },
    { label: 'Sitios gestionados', path: '/admin/sitios', icon: Globe },
    { label: 'Finanzas y planes', path: '/admin/finanzas', icon: CreditCard },
    { label: 'Mensajería & Despacho', path: '/admin/automatizaciones', icon: Send },
    { label: 'Perfiles de socios', path: '/admin/perfil', icon: User },
    { label: 'Seguridad y configuración', path: '/admin/configuracion', icon: Settings },
    { label: 'Estado y mantenimiento', path: '/admin/lanzamiento', icon: Rocket },
    { label: 'Sistema de Diseño', path: '/admin/design-system', icon: Layers },
  ];

  if (!session) {
    return <AdminSignIn onSignedIn={setSession} />;
  }

  const activeProfile = profileRepository.getProfileById(session.profileId);
  const unreadCount = notifications.filter((notification) => !notification.readAt).length;

  const handleMarkNotificationRead = (notificationId: string) => {
    try {
      mockBackendRepository.markNotificationRead(session.profileId, notificationId);
      setNotifications(mockBackendRepository.getNotifications(session.profileId));
      setNotificationError(null);
    } catch (error) {
      setNotificationError(error instanceof Error ? error.message : 'No se pudo actualizar la notificación.');
    }
  };

  return (
    <div className="admin-app-shell min-h-screen flex text-[#141413]">
      {/* Sidebar */}
      <aside
        className={`admin-sidebar bg-[#141413] text-[#F5F4EF] border-r border-[#2A2926] transition-all duration-300 flex flex-col justify-between shrink-0
          ${collapsed ? 'w-16' : 'w-64'} ${mobileNavOpen ? 'admin-sidebar-mobile-open' : ''}`}
      >
        <div>
          {/* Header Branding */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-[#2A2926]">
            {!collapsed ? (
              <div className="flex items-center gap-2 overflow-hidden">
                <LyberateLogo size="sm" showText={true} inverted={true} />
              </div>
            ) : (
              <div className="mx-auto">
                <LyberateLogo size="sm" showText={false} inverted={true} />
              </div>
            )}
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Cerrar navegación del panel"
              className="admin-mobile-close rounded-lg p-2 text-white/75 hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
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
            {navItems.map((item, index) => {
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
                  onClick={() => setMobileNavOpen(false)}
                  end={item.exact}
                  className={({ isActive }) =>
                    `admin-nav-link admin-nav-link-enter flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#7C3AED] text-white font-semibold shadow-xs'
                        : 'text-[#8A8881] hover:bg-[#2A2926] hover:text-white'
                    } ${collapsed ? 'justify-center' : ''}`
                  }
                  title={collapsed ? item.label : undefined}
                  style={{ animationDelay: `${index * 24}ms` }}
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
        <header className="admin-topbar h-16 border-b border-[#E5E3DC] px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Abrir navegación del panel"
              className="admin-mobile-menu rounded-xl border border-[#E5E3DC] bg-white p-2 text-[#292622] shadow-sm"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="relative hidden sm:block w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8881]" />
              <input
                type="text"
                placeholder="Buscar recursos..."
                aria-label="Buscar recursos en el panel"
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F5F4EF] rounded-lg border-none focus:outline-2 focus:outline-[#7C3AED]"
              />
            </div>
            <Badge variant="warning" size="sm">
              Backend simulado
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-[#5C5B56]">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span className="hidden md:inline">Sesión local de demostración</span>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen((open) => !open)}
                aria-label={`Notificaciones${unreadCount ? `, ${unreadCount} sin leer` : ''}`}
                aria-expanded={notificationsOpen}
                className="relative rounded-xl border border-[#E5E3DC] bg-white p-2 text-[#5C5B56] hover:text-[#7C3AED]"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-[#7C3AED] px-1 text-center text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notificationsOpen && (
                <div className="admin-notification-popover" role="region" aria-label="Notificaciones">
                  <div className="flex items-center justify-between border-b border-[#E5E3DC] px-4 py-3">
                    <span className="text-sm font-semibold text-[#141413]">Avisos para {activeProfile?.name}</span>
                    <button type="button" onClick={() => setNotificationsOpen(false)} aria-label="Cerrar notificaciones">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="px-4 py-5 text-xs text-[#8A8881]">Todavía no hay avisos.</p>
                  ) : (
                    <ul className="max-h-80 divide-y divide-[#F0EFEA] overflow-y-auto">
                      {notifications.map((notification) => (
                        <li key={notification.id} className="px-4 py-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold text-[#141413]">{notification.title}</p>
                              <p className="mt-1 text-[11px] leading-relaxed text-[#5C5B56]">{notification.body}</p>
                              <time className="mt-2 block text-[10px] text-[#8A8881]">
                                {new Date(notification.createdAt).toLocaleString()}
                              </time>
                            </div>
                            {!notification.readAt && (
                              <button
                                type="button"
                                onClick={() => handleMarkNotificationRead(notification.id)}
                                className="shrink-0 text-[10px] font-semibold text-[#7C3AED]"
                              >
                                Marcar leída
                              </button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  {notificationError && <p className="border-t border-red-100 px-4 py-3 text-xs text-red-700" role="alert">{notificationError}</p>}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pl-4 border-l border-[#E5E3DC]">
              <div className="w-8 h-8 rounded-full bg-[#141413] text-white flex items-center justify-center text-xs font-bold avatar-brand-ring">
                {activeProfile?.name.slice(0, 2).toUpperCase() ?? 'AD'}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-semibold text-[#141413] block leading-none">{activeProfile?.name ?? session.userId}</span>
                <span className="text-[10px] text-[#8A8881] leading-none">{session.userId}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                mockBackendRepository.signOut();
                setSession(null);
              }}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
              className="rounded-xl p-2 text-[#8A8881] transition-colors hover:bg-[#F5F4EF] hover:text-[#7C3AED]"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="admin-content flex-1 p-6 sm:p-8 overflow-y-auto">
          <div className="admin-demo-notice mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-950" role="status">
            <strong>Backend simulado:</strong> esta sesión, los avisos y los cambios se guardan en el navegador. No uses información real: el PIN y los permisos locales no brindan protección de servidor ni sincronización entre dispositivos.
          </div>
          <Outlet />
        </main>
      </div>
      {mobileNavOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setMobileNavOpen(false)}
          className="admin-mobile-backdrop"
        />
      )}
    </div>
  );
};
