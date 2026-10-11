import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';
import { Dialog } from '../../components/ui/Dialog';
import { Tooltip } from '../../components/ui/Tooltip';
import { Tabs } from '../../components/ui/Tabs';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Pagination } from '../../components/ui/Pagination';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { ProjectCard } from '../../components/domain/ProjectCard';
import { ProjectCarousel } from '../../components/domain/ProjectCarousel';
import { FIXTURE_PROJECTS } from '../../data/fixtures';
import { tokens } from '../../styles/tokens';

export const DesignSystemShowcase: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('tokens');
  const [currentPage, setCurrentPage] = useState(1);
  const [checkboxVal, setCheckboxVal] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#141413] font-editorial-heading">
          Showcase del Sistema Visual & Componentes — Lyberate
        </h1>
        <p className="text-xs sm:text-sm text-[#5C5B56] mt-1">
          Verificación interactiva de tokens, tipografía, estados accesibles, foco y jerarquías consolidadas en la Fase 01.
        </p>
      </div>

      {/* Tabs navigation */}
      <Tabs
        tabs={[
          { id: 'tokens', label: 'Tokens & Colorimetría' },
          { id: 'botones', label: 'Botones & Badges' },
          { id: 'tarjetas', label: 'Tarjetas & Superficies' },
          { id: 'formularios', label: 'Formularios' },
          { id: 'feedback', label: 'Alertas & Estados' },
          { id: 'navegacion', label: 'Navegación & Overlays' },
          { id: 'dominio', label: 'Componentes de Dominio' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab: Tokens & Colorimetría */}
      {activeTab === 'tokens' && (
        <div className="space-y-8">
          {/* Muestras de Color */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E3DC] space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#8A8881]">
                Paleta de Color Semántica & Contrastes WCAG
              </h3>
              <p className="text-xs text-[#5C5B56] mt-1">
                Colores calculados para garantizar contraste AAA en lectura y AA en componentes interactivos.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { name: 'Canvas Principal', hex: tokens.colors.canvas, border: true, text: '#141413', ratio: 'Fondo' },
                { name: 'Superficie', hex: tokens.colors.surface, border: true, text: '#141413', ratio: 'Base' },
                { name: 'Texto Principal', hex: tokens.colors.textMain, text: '#FFFFFF', ratio: '16.5:1 (AAA)' },
                { name: 'Texto Secundario', hex: tokens.colors.textSecondary, text: '#FFFFFF', ratio: '7.2:1 (AAA)' },
                { name: 'Marca Primaria', hex: tokens.colors.brand.primary, text: '#FFFFFF', ratio: '4.8:1 (AA)' },
                { name: 'Acento Marca', hex: tokens.colors.brand.accent, text: '#141413', ratio: 'Acento' },
              ].map((c) => (
                <div key={c.name} className="p-3 rounded-xl border border-[#E5E3DC] flex flex-col justify-between" style={{ backgroundColor: c.hex }}>
                  <div>
                    <span className="text-[11px] font-bold block" style={{ color: c.text }}>{c.name}</span>
                    <span className="text-[10px] font-mono opacity-80 block" style={{ color: c.text }}>{c.hex}</span>
                  </div>
                  <span className="text-[9px] font-semibold mt-4 px-1.5 py-0.5 rounded bg-black/10 w-fit" style={{ color: c.text }}>
                    {c.ratio}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tipografía */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E3DC] space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#8A8881]">
              Jerarquía Tipográfica Editorial
            </h3>
            <div className="space-y-4 divide-y divide-[#F0EFEA]">
              <div className="pt-2">
                <span className="text-[10px] font-mono text-[#8A8881] block">Heading (Playfair Display)</span>
                <p className="text-3xl font-bold font-editorial-heading text-[#141413] mt-1">
                  Software con criterio, arquitectura sólida y presencia memorable.
                </p>
              </div>
              <div className="pt-4">
                <span className="text-[10px] font-mono text-[#8A8881] block">Body (Plus Jakarta Sans)</span>
                <p className="text-sm text-[#5C5B56] leading-relaxed mt-1 font-editorial-body max-w-2xl">
                  Rechazamos las plantillas genéricas, las soluciones sobrecargadas de dependencias frágiles y las falsas promesas tecnológicas. Cada sistema responde a necesidades operativas reales.
                </p>
              </div>
              <div className="pt-4">
                <span className="text-[10px] font-mono text-[#8A8881] block">Monospace & Telemetría (System Mono)</span>
                <p className="text-xs font-mono text-[#141413] mt-1 bg-[#FBFBF9] p-2.5 rounded-lg border border-[#E5E3DC] inline-block">
                  lyberate.architecture --status=verified --tests=69/69
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Botones & Badges */}
      {activeTab === 'botones' && (
        <div className="space-y-8 bg-white p-6 rounded-2xl border border-[#E5E3DC]">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#8A8881] mb-4">Variantes de Botón</h3>
            <div className="flex flex-wrap gap-3 items-center">
              <Button variant="primary">Primario (Brand)</Button>
              <Button variant="secondary">Secundario (Ink)</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Peligro</Button>
              <Button variant="primary" isLoading>Cargando</Button>
              <Button variant="primary" disabled>Deshabilitado</Button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#8A8881] mb-4">Tamaños de Botón</h3>
            <div className="flex flex-wrap gap-3 items-center">
              <Button size="sm">Pequeño (sm)</Button>
              <Button size="md">Mediano (md)</Button>
              <Button size="lg">Grande (lg)</Button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#8A8881] mb-4">Interacción & Tooltip</h3>
            <Tooltip content="Tooltip flotante con foco accesible">
              <Button variant="outline" size="sm">Pasa el ratón o enfoca con Tab</Button>
            </Tooltip>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#8A8881] mb-4">Badges de Estado & Relación</h3>
            <div className="flex flex-wrap gap-2.5 items-center">
              <Badge variant="brand">Proyecto Propio</Badge>
              <Badge variant="neutral">Cliente</Badge>
              <Badge variant="info">Colaboración</Badge>
              <Badge variant="warning">Gestionado</Badge>
              <Badge variant="success">Operativo</Badge>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Tarjetas & Superficies */}
      {activeTab === 'tarjetas' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E5E3DC]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#8A8881] mb-2">
              Primitiva Atómica: Componente Card
            </h3>
            <p className="text-xs text-[#5C5B56] mb-6">
              Contenedor estandarizado para evitar estilos duplicados en tarjetas a lo largo de toda la plataforma.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card variant="default">
                <CardHeader>
                  <CardTitle>Variante Default</CardTitle>
                  <CardDescription>Borde sutil y sombra mínima para contenido estándar.</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-[#5C5B56]">
                  Estructura modular con slots limpios para header, content y footer.
                </CardContent>
                <CardFooter className="text-xs text-[#8A8881]">
                  <span>Pie de tarjeta</span>
                </CardFooter>
              </Card>

              <Card variant="subtle">
                <CardHeader>
                  <CardTitle>Variante Subtle</CardTitle>
                  <CardDescription>Fondo crema cálido (#FBFBF9) para jerarquía secundaria.</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-[#5C5B56]">
                  Ideal para bloques explicativos o notas de contexto técnico.
                </CardContent>
                <CardFooter className="text-xs text-[#8A8881]">
                  <span>Fondo atenuado</span>
                </CardFooter>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Variante Elevated</CardTitle>
                  <CardDescription>Sombra suave para destacar bloques de primer plano.</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-[#5C5B56]">
                  Diseñada para modales, paneles flotantes y resúmenes de KPIs.
                </CardContent>
                <CardFooter className="text-xs text-[#8A8881]">
                  <span>Elevación suave</span>
                </CardFooter>
              </Card>

              <Card variant="interactive">
                <CardHeader>
                  <CardTitle>Variante Interactive</CardTitle>
                  <CardDescription>Hover reactivo controlado con foco accesible.</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-[#5C5B56]">
                  Respuesta visual sutil sin saltos bruscos de layout.
                </CardContent>
                <CardFooter className="text-xs font-semibold text-[#7C3AED]">
                  <span>Explorar →</span>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Formularios */}
      {activeTab === 'formularios' && (
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-[#E5E3DC] max-w-2xl">
          <Input
            label="Nombre completo"
            placeholder="Ej. Carlos Mendoza"
            helperText="Requerido para la solicitud de contacto."
            required
          />
          <Input
            label="Correo electrónico con error de validación"
            placeholder="ejemplo@empresa"
            error="El formato del correo electrónico no es válido."
            defaultValue="invalido"
          />
          <Select
            label="Tipo de proyecto o servicio"
            options={[
              { value: 'web', label: 'Desarrollo Web Editorial' },
              { value: 'pos', label: 'Sistema de Gestión / POS' },
              { value: 'api', label: 'Integración de APIs y Conectividad' },
            ]}
          />
          <Textarea
            label="Descripción del requerimiento"
            placeholder="Explica brevemente el alcance técnico..."
            rows={4}
          />
          <Checkbox
            label="Acepto los términos éticos y la política de privacidad de Lyberate"
            checked={checkboxVal}
            onChange={(e) => setCheckboxVal(e.target.checked)}
          />
        </div>
      )}

      {/* Tab: Alertas & Estados */}
      {activeTab === 'feedback' && (
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-[#E5E3DC]">
          <Alert variant="info" title="Información de Auditoría">
            El proyecto opera bajo el Contrato Maestro. Cero datos simulados como completados.
          </Alert>
          <Alert variant="success" title="Operación Verificada">
            Todas las pruebas de accesibilidad y tipado han finalizado con éxito.
          </Alert>
          <Alert variant="warning" title="Atribución Pendiente">
            El proyecto Wilanye se encuentra en estado de borrador hasta autorización contractual.
          </Alert>
          <Alert variant="error" title="Restricción de Seguridad">
            El acceso al Control Room requiere autenticación estricta con rol asignado.
          </Alert>

          <div className="pt-6 border-t border-[#E5E3DC] grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border border-[#E5E3DC] rounded-xl">
              <h4 className="text-xs font-bold text-[#8A8881] uppercase mb-4">Estado Vacío (EmptyState)</h4>
              <EmptyState
                title="Sin proyectos coincidentes"
                description="Prueba ajustando los filtros de categoría o buscando por otra tecnología."
                action={
                  <Button size="sm" variant="outline" onClick={() => alert('Filtros reiniciados')}>
                    Limpiar filtros
                  </Button>
                }
              />
            </div>
            <div className="p-4 border border-[#E5E3DC] rounded-xl">
              <h4 className="text-xs font-bold text-[#8A8881] uppercase mb-4">Estado de Error (ErrorState)</h4>
              <ErrorState
                title="Fallo al consultar telemetría"
                message="No se pudo contactar con el endpoint de verificación remota."
                onRetry={() => alert('Reintentando')}
              />
            </div>
            <div className="p-4 border border-[#E5E3DC] rounded-xl flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#8A8881] uppercase mb-4">Carga Accesible (Skeleton)</h4>
                <div className="space-y-2.5">
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                  <Skeleton className="h-3 w-full rounded-md" />
                  <Skeleton className="h-3 w-1/2 rounded-md" />
                </div>
              </div>
              <p className="text-[11px] text-[#8A8881] mt-4">
                Animación atenuada respetando prefers-reduced-motion.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Navegación & Overlays */}
      {activeTab === 'navegacion' && (
        <div className="space-y-8 bg-white p-6 rounded-2xl border border-[#E5E3DC]">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#8A8881] mb-3">Migas de Pan (Breadcrumb)</h3>
            <Breadcrumb
              items={[
                { label: 'Inicio', href: '/' },
                { label: 'Trabajos & Casos', href: '/trabajos' },
                { label: 'Sagitta' },
              ]}
            />
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#8A8881] mb-3">Paginación Accesible</h3>
            <Pagination
              currentPage={currentPage}
              totalPages={5}
              onPageChange={setCurrentPage}
            />
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#8A8881] mb-3">Ventana Modal (Dialog)</h3>
            <Button onClick={() => setDialogOpen(true)}>Abrir Diálogo Modal Accesible</Button>
          </div>

          <Dialog
            isOpen={dialogOpen}
            onClose={() => setDialogOpen(false)}
            title="Especificación de Accesibilidad"
            description="Control estricto de foco y tecla Escape implementado en el sistema."
            footer={
              <Button size="sm" onClick={() => setDialogOpen(false)}>
                Entendido
              </Button>
            }
          >
            <p className="text-xs text-[#5C5B56] leading-relaxed">
              El cuadro de diálogo modal aísla el foco, bloquea el scroll del fondo y garantiza que los usuarios de teclado puedan interactuar sin perderse.
            </p>
          </Dialog>
        </div>
      )}

      {/* Tab: Componentes de Dominio */}
      {activeTab === 'dominio' && (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-[#E5E3DC]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#8A8881] mb-4">
              Carrusel Interactivo de Inicio (ProjectCarousel)
            </h3>
            <ProjectCarousel projects={FIXTURE_PROJECTS.filter((p) => p.isFeaturedInHomeCarousel)} />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5E3DC]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#8A8881] mb-4">
              Tarjeta de Proyecto en Catálogo (ProjectCard con Fallback)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FIXTURE_PROJECTS.slice(0, 2).map((proj) => (
                <ProjectCard key={proj.id} project={proj} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
