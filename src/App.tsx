import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { ProductsPage } from './pages/public/ProductsPage';
import { WorksPage } from './pages/public/WorksPage';
import { ProjectDetailPage } from './pages/public/ProjectDetailPage';
import { ContactPage } from './pages/public/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages (Control Room)
import { ControlRoomOverview } from './pages/admin/ControlRoomOverview';
import { ProjectsHubPage } from './pages/admin/ProjectsHubPage';
import { DesignSystemShowcase } from './pages/admin/DesignSystemShowcase';
import { CmsDashboard } from './pages/admin/CmsDashboard';
import { CmsPageEditor } from './pages/admin/CmsPageEditor';
import { CmsProjectManager } from './pages/admin/CmsProjectManager';
import { SitesHubPage } from './pages/admin/SitesHubPage';
import { CrmHubPage } from './pages/admin/CrmHubPage';
import { FinanceHubPage } from './pages/admin/FinanceHubPage';
import { AutomationsHubPage } from './pages/admin/AutomationsHubPage';
import { ProfileHubPage } from './pages/admin/ProfileHubPage';
import { SecurityRbacHubPage } from './pages/admin/SecurityRbacHubPage';
import { LaunchOperationsHubPage } from './pages/admin/LaunchOperationsHubPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Árbol Público Lyberate */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/sobre-nosotros" element={<AboutPage />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/trabajos" element={<WorksPage />} />
          <Route path="/trabajos/:slug" element={<ProjectDetailPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Árbol Privado Administrativo (Lyberate Control Room) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<ControlRoomOverview />} />
          <Route path="proyectos" element={<ProjectsHubPage />} />
          <Route path="design-system" element={<DesignSystemShowcase />} />
          <Route path="cms" element={<CmsDashboard />} />
          <Route path="cms/editor/:pageId" element={<CmsPageEditor />} />
          <Route path="cms/proyectos" element={<CmsProjectManager />} />
          <Route path="sitios" element={<SitesHubPage />} />
          <Route path="crm" element={<CrmHubPage />} />
          <Route path="finanzas" element={<FinanceHubPage />} />
          <Route path="automatizaciones" element={<AutomationsHubPage />} />
          <Route path="perfil" element={<ProfileHubPage />} />
          <Route path="configuracion" element={<SecurityRbacHubPage />} />
          <Route path="lanzamiento" element={<LaunchOperationsHubPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

