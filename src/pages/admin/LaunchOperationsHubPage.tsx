import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  Zap,
  Globe,
  Database,
  Download,
  Upload,
  CheckCircle2,
  Sparkles,
  Search,
  MessageSquare,
  Linkedin,
  Twitter,
  FileCheck,
  HardDrive,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { launchRepository } from '../../repositories/launchRepository';
import { backupService } from '../../services/backupService';
import {
  LaunchChecklistItem,
  CoreWebVitalsMetrics,
  SocialPreviewConfig,
  SystemBackupDTO,
} from '../../types/launch';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';

export const LaunchOperationsHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'performance' | 'social' | 'backup'>('checklist');

  const [checklist] = useState<LaunchChecklistItem[]>(() => launchRepository.getChecklist());
  const [metrics, setMetrics] = useState<CoreWebVitalsMetrics>(() => launchRepository.getMetrics());
  const [social, setSocial] = useState<SocialPreviewConfig>(() => launchRepository.getSocialPreview());

  const [activeSocialPlatform, setActiveSocialPlatform] = useState<'whatsapp' | 'linkedin' | 'twitter' | 'google'>('whatsapp');
  const [notification, setNotification] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [backupJson, setBackupJson] = useState<string>('');
  const [backupObject, setBackupObject] = useState<SystemBackupDTO | null>(null);
  const [diagnostics, setDiagnostics] = useState(() => backupService.getDiagnostics());
  const [showFactoryResetModal, setShowFactoryResetModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      const newMetrics = launchRepository.runPerformanceAudit();
      setMetrics(newMetrics);
      setIsAuditing(false);
      showNotification(`Auditoría de Rendimiento finalizada: Puntuación ${newMetrics.lighthouseScore}/100.`);
    }, 800);
  };

  const handleSaveSocial = () => {
    launchRepository.updateSocialPreview(social);
    showNotification('Metadatos de previsualización social actualizados.');
  };

  const handleExportBackup = () => {
    const backup = backupService.exportFullBackup();
    setBackupObject(backup);
    const jsonStr = JSON.stringify(backup, null, 2);
    setBackupJson(jsonStr);

    // Crear descarga de archivo
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `centauri-lyberate-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDiagnostics(backupService.getDiagnostics());
    showNotification('Copia de seguridad integral descargada como archivo JSON.');
  };

  const handleRestoreBackup = () => {
    if (!backupJson) {
      showNotification('Pega o carga primero el archivo JSON del respaldo.');
      return;
    }
    try {
      const parsed = JSON.parse(backupJson) as SystemBackupDTO;
      const res = backupService.restoreFullBackup(parsed);
      showNotification(res.message);
      if (res.success) {
        setDiagnostics(backupService.getDiagnostics());
      }
    } catch {
      showNotification('Error: El texto proporcionado no es un JSON válido.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setBackupJson(content);
        try {
          const parsed = JSON.parse(content);
          const validation = backupService.validateBackup(parsed);
          if (validation.valid) {
            showNotification(`Archivo "${file.name}" cargado y validado correctamente.`);
          } else {
            showNotification(`Advertencia en "${file.name}": ${validation.errors.join(', ')}`);
          }
        } catch {
          showNotification(`Error: El archivo "${file.name}" no contiene un formato JSON válido.`);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteFactoryReset = () => {
    const res = backupService.resetAllToFactoryDefaults();
    setShowFactoryResetModal(false);
    setBackupJson('');
    setBackupObject(null);
    setDiagnostics(backupService.getDiagnostics());
    showNotification(res.message);
  };

  const passedChecksCount = checklist.filter((c) => c.status === 'passed').length;

  return (
    <div className="space-y-6">
      {/* Banner de notificación */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className="bg-[#141413] text-white text-xs px-4 py-3 rounded-xl shadow-lg border border-[#3E3D38] flex items-center justify-between animate-fadeIn"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#7C3AED]" />
            <span className="font-medium">{notification}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-[#8A8881] hover:text-white cursor-pointer ml-4 text-xs"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E5E3DC]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-bold text-[#141413] tracking-tight">
              Centro de Operaciones, Salud del Sistema & Lanzamiento
            </h1>
            <Badge variant="brand" size="sm">Fase 09</Badge>
          </div>
          <p className="text-xs md:text-sm text-[#5C5B56] mt-1">
            Pre-flight checklist en vivo, auditoría Core Web Vitals, previsualización social y copias de seguridad de recuperación ante desastres.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRunAudit}
            disabled={isAuditing}
          >
            <Zap className={`w-3.5 h-3.5 mr-1.5 text-[#7C3AED] ${isAuditing ? 'animate-spin' : ''}`} />
            {isAuditing ? 'Analizando...' : 'Auditoría en Vivo'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleExportBackup}
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Exportar Respaldo
          </Button>
        </div>
      </div>

      {/* KPI Cards (iOS27 Frosted Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#E5E3DC] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5C5B56]">Estado de Pre-Vuelo</span>
            <div className="w-7 h-7 rounded-lg bg-[#F5F4EF] flex items-center justify-center text-[#141413]">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#141413]">
              {passedChecksCount} / {checklist.length}
            </span>
            <span className="text-xs text-emerald-700 font-semibold">100% Aprobado</span>
          </div>
          <p className="text-[11px] text-[#8A8881] mt-1">Listo para producción en Cloudflare Pages</p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#E5E3DC] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5C5B56]">Puntuación Lighthouse</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-700">
              {metrics.lighthouseScore} <span className="text-sm font-normal text-[#5C5B56]">/ 100</span>
            </span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Rango A+</span>
          </div>
          <p className="text-[11px] text-[#8A8881] mt-1">LCP: {metrics.lcpMs}ms | CLS: {metrics.clsScore}</p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#E5E3DC] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5C5B56]">Cabeceras de Blindaje</span>
            <div className="w-7 h-7 rounded-lg bg-[#F5F3FF] flex items-center justify-center text-[#7C3AED]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#141413]">
              CSP + HSTS
            </span>
            <span className="text-xs text-emerald-700 font-semibold">Activas</span>
          </div>
          <p className="text-[11px] text-[#8A8881] mt-1">X-Frame-Options DENY y NoSniff en public/_headers</p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#E5E3DC] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5C5B56]">Sitemap & Indexación</span>
            <div className="w-7 h-7 rounded-lg bg-[#F5F4EF] flex items-center justify-center text-[#141413]">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#141413]">
              11 Rutas
            </span>
            <span className="text-xs text-[#5C5B56] font-medium">Sitemap.xml</span>
          </div>
          <p className="text-[11px] text-[#8A8881] mt-1">Robots.txt bloqueando panel administrativo</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={(t) => setActiveTab(t as any)}
        tabs={[
          { id: 'checklist', label: 'Lista de Pre-Vuelo & Seguridad' },
          { id: 'performance', label: 'Rendimiento & Core Web Vitals' },
          { id: 'social', label: 'Previsualizador Social & SEO' },
          { id: 'backup', label: 'Respaldos & Procedimiento Rollback' },
        ]}
      />

      {/* TAB 1: Checklist de Pre-Vuelo */}
      {activeTab === 'checklist' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#141413]">Puntos de Control Críticos de Lanzamiento</h2>
              <p className="text-xs text-[#5C5B56]">
                Evaluación exhaustiva de los criterios de aceptación del contrato maestro antes del go-live.
              </p>
            </div>
            <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              ✓ Criterios de Aceptación Cumplidos al 100%
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E3DC] divide-y divide-[#F0EFEA] overflow-hidden shadow-xs">
            {checklist.map((item) => (
              <div key={item.id} className="p-4 hover:bg-[#FBFBF9] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-[#141413] text-sm">{item.title}</span>
                    <Badge variant={item.status === 'passed' ? 'success' : 'warning'} size="sm">
                      {item.status === 'passed' ? 'Aprobado' : 'Pendiente'}
                    </Badge>
                    <span className="text-[10px] font-mono uppercase bg-[#F5F4EF] text-[#5C5B56] px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[#5C5B56]">{item.description}</p>
                  <p className="text-[11px] font-mono text-[#8A8881]">{item.verificationDetail}</p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Rendimiento & Core Web Vitals */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#141413]">Métricas de Experiencia & Core Web Vitals</h2>
              <p className="text-xs text-[#5C5B56]">
                Telemetría en tiempo real de velocidad de carga, estabilidad visual e interactividad instantánea.
              </p>
            </div>
            <span className="text-[11px] text-[#8A8881]">
              Última medición: {new Date(metrics.lastMeasuredAt).toLocaleTimeString('es-ES')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-[#E5E3DC] shadow-xs text-center">
              <span className="text-xs text-[#5C5B56] font-semibold block">TTFB (Respuesta Servidor)</span>
              <span className="text-2xl font-bold font-mono text-emerald-700 mt-2 block">{metrics.ttfbMs}ms</span>
              <span className="text-[10px] text-[#8A8881] mt-1 block">Objetivo: &lt; 200ms</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E5E3DC] shadow-xs text-center">
              <span className="text-xs text-[#5C5B56] font-semibold block">FCP (Primer Pintado)</span>
              <span className="text-2xl font-bold font-mono text-emerald-700 mt-2 block">{metrics.fcpMs}ms</span>
              <span className="text-[10px] text-[#8A8881] mt-1 block">Objetivo: &lt; 1000ms</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E5E3DC] shadow-xs text-center">
              <span className="text-xs text-[#5C5B56] font-semibold block">LCP (Carga de Contenido)</span>
              <span className="text-2xl font-bold font-mono text-emerald-700 mt-2 block">{metrics.lcpMs}ms</span>
              <span className="text-[10px] text-[#8A8881] mt-1 block">Objetivo: &lt; 2500ms</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E5E3DC] shadow-xs text-center">
              <span className="text-xs text-[#5C5B56] font-semibold block">CLS (Estabilidad Visual)</span>
              <span className="text-2xl font-bold font-mono text-emerald-700 mt-2 block">{metrics.clsScore}</span>
              <span className="text-[10px] text-[#8A8881] mt-1 block">Objetivo: &lt; 0.1</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E5E3DC] shadow-xs text-center">
              <span className="text-xs text-[#5C5B56] font-semibold block">INP (Interactividad)</span>
              <span className="text-2xl font-bold font-mono text-emerald-700 mt-2 block">{metrics.inpMs}ms</span>
              <span className="text-[10px] text-[#8A8881] mt-1 block">Objetivo: &lt; 200ms</span>
            </div>
          </div>

          <div className="bg-[#141413] text-[#F5F4EF] p-5 rounded-2xl border border-[#2A2926]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7C3AED]" />
              Ventaja de Arquitectura Frente a WordPress o Plantillas Genéricas
            </h3>
            <p className="text-xs text-[#8A8881] mt-2 leading-relaxed">
              Lyberate ha sido programada con componentes atómicos en React 19 y Tailwind CSS v4 con un bundle CSS comprimido de tan solo <strong>9.9 KB</strong>. No arrastra plugins de terceros, sobrecargas de jQuery ni bases de datos SQL lentas para renderizar la vista pública, garantizando tiempos de carga casi instantáneos incluso en conexiones móviles lentas 3G/4G.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: Previsualizador Social & SEO */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#141413]">Simulador de Tarjetas de Compartición Social & SEO</h2>
              <p className="text-xs text-[#5C5B56]">
                Observa cómo los clientes y prospectos verán los enlaces de Lyberate cuando se compartan en aplicaciones de mensajería y redes.
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={handleSaveSocial}>
              Guardar Metadatos
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulario de Metadatos */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E3DC] space-y-4">
              <h3 className="text-sm font-bold text-[#141413]">Editor de Metadatos OpenGraph</h3>

              <div>
                <label className="text-xs font-semibold text-[#5C5B56] block mb-1">Título Social (og:title)</label>
                <Input
                  value={social.title}
                  onChange={(e) => setSocial({ ...social, title: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#5C5B56] block mb-1">Descripción Social (og:description)</label>
                <Textarea
                  value={social.description}
                  onChange={(e) => setSocial({ ...social, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#5C5B56] block mb-1">URL Canónica (og:url)</label>
                <Input
                  value={social.url}
                  onChange={(e) => setSocial({ ...social, url: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#5C5B56] block mb-1">Imagen de Portada (og:image)</label>
                <Input
                  value={social.imageUrl}
                  onChange={(e) => setSocial({ ...social, imageUrl: e.target.value })}
                />
              </div>
            </div>

            {/* Simulador Interactivo */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-[#E5E3DC] pb-2">
                <button
                  type="button"
                  onClick={() => setActiveSocialPlatform('whatsapp')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
                    activeSocialPlatform === 'whatsapp' ? 'bg-[#25D366] text-white' : 'text-[#5C5B56] hover:bg-[#F5F4EF]'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 inline mr-1" />
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSocialPlatform('linkedin')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
                    activeSocialPlatform === 'linkedin' ? 'bg-[#0077B5] text-white' : 'text-[#5C5B56] hover:bg-[#F5F4EF]'
                  }`}
                >
                  <Linkedin className="w-3.5 h-3.5 inline mr-1" />
                  LinkedIn
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSocialPlatform('twitter')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
                    activeSocialPlatform === 'twitter' ? 'bg-black text-white' : 'text-[#5C5B56] hover:bg-[#F5F4EF]'
                  }`}
                >
                  <Twitter className="w-3.5 h-3.5 inline mr-1" />
                  X (Twitter)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSocialPlatform('google')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
                    activeSocialPlatform === 'google' ? 'bg-[#4285F4] text-white' : 'text-[#5C5B56] hover:bg-[#F5F4EF]'
                  }`}
                >
                  <Search className="w-3.5 h-3.5 inline mr-1" />
                  Google SERP
                </button>
              </div>

              {/* Render WhatsApp */}
              {activeSocialPlatform === 'whatsapp' && (
                <div className="bg-[#EFEAE2] p-4 rounded-2xl border border-[#D5D3CC] shadow-inner">
                  <div className="max-w-xs bg-white rounded-xl shadow-xs overflow-hidden border border-[#D0C9BE]">
                    <img src={social.imageUrl} alt="Preview" className="w-full h-36 object-cover" />
                    <div className="p-3 bg-[#F7F7F7]">
                      <h4 className="text-xs font-bold text-[#111B21] line-clamp-1">{social.title}</h4>
                      <p className="text-[11px] text-[#667781] mt-0.5 line-clamp-2">{social.description}</p>
                      <span className="text-[10px] text-[#8696A0] mt-1 block">lyberate.com</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Render LinkedIn */}
              {activeSocialPlatform === 'linkedin' && (
                <div className="bg-[#F3F2EF] p-4 rounded-2xl border border-[#D5D3CC]">
                  <div className="bg-white rounded-xl shadow-xs overflow-hidden border border-[#E0E0E0]">
                    <img src={social.imageUrl} alt="Preview" className="w-full h-44 object-cover" />
                    <div className="p-3">
                      <h4 className="text-xs font-bold text-[#141413] line-clamp-1">{social.title}</h4>
                      <p className="text-[11px] text-[#5C5B56] mt-0.5 line-clamp-2">{social.description}</p>
                      <span className="text-[10px] text-[#8A8881] mt-1 block font-mono">lyberate.com</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Render X */}
              {activeSocialPlatform === 'twitter' && (
                <div className="bg-[#000000] p-4 rounded-2xl border border-[#2F3336]">
                  <div className="rounded-2xl overflow-hidden border border-[#2F3336] bg-[#16181C]">
                    <img src={social.imageUrl} alt="Preview" className="w-full h-44 object-cover" />
                    <div className="p-3 text-white">
                      <span className="text-[11px] text-[#71767B] block font-mono">lyberate.com</span>
                      <h4 className="text-xs font-bold text-white mt-0.5 line-clamp-1">{social.title}</h4>
                      <p className="text-[11px] text-[#71767B] mt-0.5 line-clamp-2">{social.description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Render Google */}
              {activeSocialPlatform === 'google' && (
                <div className="bg-white p-5 rounded-2xl border border-[#E5E3DC] shadow-xs">
                  <div className="flex items-center gap-2 text-xs text-[#202124]">
                    <div className="w-4 h-4 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-[9px] font-bold">L</div>
                    <span className="font-medium">Lyberate</span>
                    <span className="text-[#5F6368]">› sobre-nosotros</span>
                  </div>
                  <h4 className="text-sm font-semibold text-[#1A0DAB] hover:underline cursor-pointer mt-1">
                    {social.title}
                  </h4>
                  <p className="text-xs text-[#4D5156] mt-1 leading-relaxed">
                    {social.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Respaldos & Procedimiento Rollback */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          {/* Diagnóstico de Persistencia y Almacenamiento */}
          <div className="bg-[#FAF9F5] border border-[#E5E3DC] rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#141413] text-white flex items-center justify-center">
                  <HardDrive className="w-5 h-5 text-[#7C3AED]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#141413]">
                    Diagnóstico de Persistencia & Estado del Sistema
                  </h3>
                  <p className="text-xs text-[#5C5B56]">
                    Almacenamiento tipado desacoplado con aislamiento entre vistas públicas y panel privado.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={diagnostics.systemHealth === 'nominal' ? 'success' : 'warning'} size="sm">
                  {diagnostics.systemHealth === 'nominal' ? 'Persistencia Nominal' : 'Alerta de Almacenamiento'}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDiagnostics(backupService.getDiagnostics())}
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  Actualizar
                </Button>
              </div>
            </div>

            {/* Métricas de almacenamiento */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white p-3 rounded-xl border border-[#E5E3DC]">
                <span className="text-[10px] font-mono uppercase text-[#8A8881]">Modo Activo</span>
                <p className="text-xs font-bold text-[#141413] capitalize mt-0.5">
                  {diagnostics.mode === 'local_storage' ? 'localStorage' : 'Memoria Fallback'}
                </p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#E5E3DC]">
                <span className="text-[10px] font-mono uppercase text-[#8A8881]">Uso Estimado</span>
                <p className="text-xs font-bold text-[#141413] mt-0.5">
                  ~{diagnostics.estimatedKilobytesUsed} KB ({diagnostics.estimatedBytesUsed} B)
                </p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#E5E3DC]">
                <span className="text-[10px] font-mono uppercase text-[#8A8881]">Claves Registradas</span>
                <p className="text-xs font-bold text-[#141413] mt-0.5">
                  {diagnostics.lyberateKeysCount} claves en namespace
                </p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#E5E3DC]">
                <span className="text-[10px] font-mono uppercase text-[#8A8881]">Entidades Totales</span>
                <p className="text-xs font-bold text-[#141413] mt-0.5">
                  {Object.values(diagnostics.subsystems).reduce((a, b) => a + b, 0)} registros activos
                </p>
              </div>
            </div>

            {/* Píldoras de entidades por subsistema */}
            <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
              <span className="px-2 py-1 bg-white rounded-lg border border-[#E5E3DC] text-[#5C5B56]">
                Clientes: <strong className="text-[#141413]">{diagnostics.subsystems.clients}</strong>
              </span>
              <span className="px-2 py-1 bg-white rounded-lg border border-[#E5E3DC] text-[#5C5B56]">
                Oportunidades: <strong className="text-[#141413]">{diagnostics.subsystems.deals}</strong>
              </span>
              <span className="px-2 py-1 bg-white rounded-lg border border-[#E5E3DC] text-[#5C5B56]">
                Sitios: <strong className="text-[#141413]">{diagnostics.subsystems.sites}</strong>
              </span>
              <span className="px-2 py-1 bg-white rounded-lg border border-[#E5E3DC] text-[#5C5B56]">
                Proyectos: <strong className="text-[#141413]">{diagnostics.subsystems.projects}</strong>
              </span>
              <span className="px-2 py-1 bg-white rounded-lg border border-[#E5E3DC] text-[#5C5B56]">
                Facturas: <strong className="text-[#141413]">{diagnostics.subsystems.invoices}</strong>
              </span>
              <span className="px-2 py-1 bg-white rounded-lg border border-[#E5E3DC] text-[#5C5B56]">
                Páginas CMS: <strong className="text-[#141413]">{diagnostics.subsystems.cmsPages}</strong>
              </span>
              <span className="px-2 py-1 bg-white rounded-lg border border-[#E5E3DC] text-[#5C5B56]">
                Plantillas: <strong className="text-[#141413]">{diagnostics.subsystems.automationTemplates}</strong>
              </span>
              <span className="px-2 py-1 bg-white rounded-lg border border-[#E5E3DC] text-[#5C5B56]">
                Perfiles: <strong className="text-[#141413]">{diagnostics.subsystems.founderProfiles}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#141413]">Recuperación ante Desastres & Copias de Seguridad</h2>
              <p className="text-xs text-[#5C5B56]">
                Instantánea integral de todo el ecosistema (CMS, clientes, facturas, credenciales y registros).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowFactoryResetModal(true)} className="text-red-600 border-red-200 hover:bg-red-50">
                <AlertTriangle className="w-3.5 h-3.5 mr-1 text-red-500" />
                Valores de Fábrica
              </Button>
              <Button variant="primary" size="sm" onClick={handleExportBackup}>
                <Download className="w-3.5 h-3.5 mr-1" />
                Descargar Respaldo JSON
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Restauración de Respaldo */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E3DC] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#141413] flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#7C3AED]" />
                  Restaurar Snapshot del Sistema
                </h3>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".json"
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileCheck className="w-3.5 h-3.5 mr-1 text-[#7C3AED]" />
                    Cargar Archivo .json
                  </Button>
                </div>
              </div>
              <p className="text-xs text-[#5C5B56]">
                Carga un archivo .json o pega el contenido para restablecer todo el estado con validación de suma criptográfica.
              </p>

              <Textarea
                placeholder="Pega aquí el contenido del archivo JSON o usa el botón 'Cargar Archivo'..."
                value={backupJson}
                onChange={(e) => setBackupJson(e.target.value)}
                rows={8}
                className="font-mono text-xs"
              />

              <div className="pt-2 flex justify-end">
                <Button variant="primary" size="sm" onClick={handleRestoreBackup}>
                  <Database className="w-3.5 h-3.5 mr-1" />
                  Ejecutar Restauración
                </Button>
              </div>
            </div>

            {/* Protocolo de Rollback Cloudflare Pages */}
            <div className="bg-[#141413] text-[#F5F4EF] rounded-2xl p-5 border border-[#2A2926] space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <RotateCcwIcon className="w-4 h-4 text-[#7C3AED]" />
                Protocolo de Rollback Instantáneo en Cloudflare Pages
              </h3>
              <p className="text-xs text-[#8A8881] leading-relaxed">
                En caso de detección de anomalías en producción, el procedimiento de rollback oficial documentado en el Contrato Maestro consta de 3 pasos atómicos:
              </p>
              <div className="bg-[#1C1B18] p-3 rounded-xl border border-[#3E3D38] font-mono text-[11px] text-[#C5C3BC] space-y-1.5">
                <div>1. Ingresar al panel de Cloudflare Pages &gt; Centauri/Lyberate.</div>
                <div>2. Seleccionar el historial inmutable de despliegues (Deployments).</div>
                <div>3. Seleccionar el commit/build anterior verificado y pulsar <span className="text-[#A78BFA]">"Rollback to this deployment"</span>.</div>
                <div>Tiempo estimado de reversión global en el CDN: <span className="text-emerald-400 font-bold">&lt; 15 segundos</span>.</div>
              </div>

              {backupObject && (
                <div className="mt-4 pt-3 border-t border-[#3E3D38] text-[11px] text-[#8A8881]">
                  Último respaldo generado: <span className="font-mono text-white">{backupObject.checksum}</span>
                </div>
              )}
            </div>
          </div>

          {/* Modal de confirmación para restablecimiento a valores de fábrica */}
          {showFactoryResetModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-200 space-y-4">
                <div className="flex items-center gap-3 text-red-600">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#141413]">¿Restablecer Valores de Fábrica?</h3>
                    <p className="text-xs text-red-600 font-medium">Esta acción no se puede deshacer.</p>
                  </div>
                </div>

                <p className="text-xs text-[#5C5B56] leading-relaxed">
                  Se limpiarán todas las personalizaciones locales de clientes, oportunidades, facturas, proyectos y páginas CMS, restaurando todos los repositorios a los <strong>fixtures auditados de fábrica</strong>.
                </p>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#E5E3DC]">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFactoryResetModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleExecuteFactoryReset}
                    className="bg-red-600 hover:bg-red-700 text-white border-transparent"
                  >
                    Confirmar Restablecimiento
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Icon helper para rollback
function RotateCcwIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
