import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Code2,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Layers,
  MessageSquare,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { ProjectCarousel } from '../../components/domain/ProjectCarousel';
import { EcosystemVisualizer } from '../../components/domain/EcosystemVisualizer';
import { projectRepository } from '../../repositories/projectRepository';
import { cmsRepository } from '../../repositories/cmsRepository';
import { FIXTURE_SERVICES, FIXTURE_PRODUCTS } from '../../data/fixtures';

export const HomePage: React.FC = () => {
  const featuredProjects = projectRepository.getFeaturedProjects();
  const cmsContent = cmsRepository.getPageContent('home');

  useEffect(() => {
    if (cmsContent.seo?.metaTitle) {
      document.title = cmsContent.seo.metaTitle;
    }
  }, [cmsContent.seo?.metaTitle]);

  const isSectionVisible = (id: string) => {
    const sec = cmsContent.sectionsConfig?.find((s) => s.id === id);
    return sec ? sec.isVisible : true;
  };

  const hero = cmsContent.hero || {
    eyebrow: 'Estudio de Ingeniería & Arquitectura de Software',
    headline: 'Software con criterio, arquitectura sólida y presencia memorable.',
    description:
      'Construimos plataformas digitales, sistemas de gestión y productos web para organizaciones que valoran la claridad visual, el alto rendimiento y la independencia tecnológica.',
    primaryCtaText: 'Conversar sobre tu proyecto',
    primaryCtaLink: '/contacto',
    secondaryCtaText: 'Explorar trabajos y casos',
    secondaryCtaLink: '/trabajos',
    badges: ['React 19 + TypeScript', 'Accesibilidad WCAG universal', 'Arquitectura desacoplada'],
  };

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* 1. Hero Section con Composición Editorial Propia */}
      {isSectionVisible('hero') && (
        <section className="relative pt-16 sm:pt-24 pb-16 overflow-hidden bg-subtle-mesh border-b border-[#E5E3DC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Headline y Propuesta de Valor (col-span-7) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F4EF] border border-[#E5E3DC] text-xs font-semibold text-[#C85A32]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{hero.eyebrow}</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#141413] leading-[1.08] font-editorial-heading">
                  {hero.headline}
                </h1>

                <p className="text-base sm:text-lg text-[#5C5B56] leading-relaxed max-w-2xl font-editorial-body">
                  {hero.description}
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link to={hero.primaryCtaLink}>
                    <Button size="lg" variant="primary">
                      {hero.primaryCtaText}
                    </Button>
                  </Link>
                  <Link to={hero.secondaryCtaLink}>
                    <Button size="lg" variant="outline">
                      {hero.secondaryCtaText}
                    </Button>
                  </Link>
                </div>

                {/* Franja de confianza técnica verificada */}
                <div className="pt-6 border-t border-[#E5E3DC] flex flex-wrap gap-6 text-xs text-[#5C5B56]">
                  {hero.badges.map((badge, idx) => {
                    const colors = ['bg-emerald-500', 'bg-[#C85A32]', 'bg-[#141413]'];
                    return (
                      <div key={badge} className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${colors[idx % colors.length]}`} />
                        <span>{badge}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Composición Gráfica Editorial de Marca (col-span-5) */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md bg-white p-6 rounded-3xl border border-[#E5E3DC] shadow-[0_12px_40px_rgba(20,20,19,0.06)] space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA]">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#C85A32]" />
                      <div className="w-3 h-3 rounded-full bg-[#D1CEBF]" />
                      <div className="w-3 h-3 rounded-full bg-[#E5E3DC]" />
                    </div>
                    <span className="text-[11px] font-mono text-[#8A8881]">lyberate.ecosystem.v2</span>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <Link
                      to="/trabajos/sagitta"
                      className="block p-3.5 bg-[#FBFBF9] rounded-xl border border-[#E5E3DC] hover:border-[#C85A32] transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[#8A8881] text-[10px] uppercase font-bold">Plataforma Componible</span>
                        <ArrowRight className="w-3 h-3 text-[#8A8881] group-hover:text-[#C85A32] transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <span className="text-[#141413] font-semibold block mt-0.5">Sagitta Enterprise Engine</span>
                      <span className="text-emerald-700 block text-[11px] mt-0.5 font-sans">
                        ✓ Módulos conmutables, POS & inventario BOM
                      </span>
                    </Link>

                    <Link
                      to="/trabajos/contacto-con-la-noticia"
                      className="block p-3.5 bg-[#FBFBF9] rounded-xl border border-[#E5E3DC] hover:border-[#C85A32] transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[#8A8881] text-[10px] uppercase font-bold">Portal Periodístico</span>
                        <ArrowRight className="w-3 h-3 text-[#8A8881] group-hover:text-[#C85A32] transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <span className="text-[#141413] font-semibold block mt-0.5">Contacto con la Noticia</span>
                      <span className="text-emerald-700 block text-[11px] mt-0.5 font-sans">
                        ✓ PWA sin conexión & redacción en tiempo real
                      </span>
                    </Link>

                    <div className="p-3.5 bg-[#FBFBF9] rounded-xl border border-[#E5E3DC]">
                      <div className="flex items-center justify-between">
                        <span className="text-[#8A8881] text-[10px] uppercase font-bold">Atención & Chat SaaS</span>
                        <span className="text-amber-700 text-[10px] font-bold">BETA</span>
                      </div>
                      <span className="text-[#141413] font-semibold block mt-0.5">LyberateDesk / Chat</span>
                      <span className="text-emerald-700 block text-[11px] mt-0.5 font-sans">
                        ✓ WhatsApp multicanal & respuestas directas
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F5F4EF] text-center text-xs text-[#5C5B56] font-sans flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Sistemas auditados y verificados en código.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Visualización Interactiva del Ecosistema (Master Contract Sección 7) */}
      {isSectionVisible('ecosystem') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EcosystemVisualizer />
        </section>
      )}

      {/* 3. Carrusel / Vitrina de Proyectos Integrado en Inicio */}
      {isSectionVisible('carousel') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <SectionHeader
              eyebrow="Vitrina de Trabajos"
              title="Sistemas y proyectos destacados"
              description="Explora desarrollos reales con rotación automática de 5s, pausa inteligente y alternador entre beneficios para el negocio y ficha técnica."
              className="mb-0"
            />
            <Link
              to="/trabajos"
              className="inline-flex items-center text-xs font-bold text-[#C85A32] hover:underline gap-1 shrink-0"
            >
              <span>Ver catálogo completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Carrusel interactivo con 5s auto-play y barra iOS */}
          <ProjectCarousel projects={featuredProjects} />
        </section>
      )}

      {/* 4. Qué podemos construir (Servicios Principales) */}
      {isSectionVisible('services') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Qué construimos"
            title="Capacidades y soluciones de software"
            description="Enfoque riguroso centrado en resolver problemas operativos reales sin añadir dependencias frágiles ni costes ocultos."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FIXTURE_SERVICES.map((service, index) => {
              const icons = [Code2, Cpu, ShieldCheck];
              const Icon = icons[index % icons.length];
              return (
                <Card
                  key={service.id}
                  variant="default"
                  className="flex flex-col justify-between hover:border-[#D1CEBF] transition-colors"
                >
                  <CardHeader>
                    <div className="w-10 h-10 rounded-xl bg-[#F5F4EF] flex items-center justify-center text-[#C85A32] mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-lg font-bold text-[#141413]">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-[#5C5B56] leading-relaxed mt-2">
                      {service.summary}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-0">
                    <div className="p-3 rounded-xl bg-[#FBFBF9] border border-[#E5E3DC]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8881] block mb-1">
                        ¿Qué problema resuelve?
                      </span>
                      <p className="text-xs text-[#141413] leading-normal">{service.problemSolved}</p>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-[#8A8881] uppercase tracking-wider block mb-2">
                        Entregables habituales:
                      </span>
                      <ul className="space-y-1 text-xs text-[#141413]">
                        {service.typicalDeliverables.slice(0, 3).map((item) => (
                          <li key={item} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-[#C85A32]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-4 border-t border-[#F0EFEA] flex items-center justify-between">
                    <span className="text-[11px] text-[#8A8881]">Presupuesto con alcance claro</span>
                    <Link
                      to="/contacto"
                      className="text-xs font-semibold text-[#C85A32] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Consultar</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. Presentación de Productos Propios (Distintos de servicios de cliente) */}
      {isSectionVisible('products') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Productos Propios"
            title="Plataformas desarrolladas por Lyberate"
            description="Software propio concebido para resolver necesidades comerciales especializadas, disponible para implementación o suscripción."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FIXTURE_PRODUCTS.map((prod) => {
              const isDesk = prod.slug.includes('lyberatedesk') || prod.slug.includes('chat');
              return (
                <div
                  key={prod.id}
                  className="bg-white rounded-3xl border border-[#E5E3DC] p-7 flex flex-col justify-between hover:border-[#D1CEBF] transition-colors relative"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#C85A32] uppercase tracking-widest bg-[#F5F4EF] px-2.5 py-1 rounded-full border border-[#E5E3DC]">
                        {isDesk ? 'PRODUCTO SAAS' : 'PRODUCTO ACTIVO'}
                      </span>
                      {isDesk ? (
                        <MessageSquare className="w-4 h-4 text-[#C85A32]" />
                      ) : (
                        <Layers className="w-4 h-4 text-[#5C5B56]" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-[#141413] font-editorial-heading">
                        {prod.name}
                      </h3>
                      <p className="text-xs font-semibold text-[#C85A32] mt-0.5">{prod.tagline}</p>
                    </div>

                    <p className="text-xs text-[#5C5B56] leading-relaxed">{prod.summary}</p>

                    <div className="space-y-2 pt-2 border-t border-[#F0EFEA]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8881] block">
                        Capacidades verificadas:
                      </span>
                      {prod.verifiedFeatures.slice(0, 3).map((feat) => (
                        <div key={feat} className="flex items-start gap-2 text-xs text-[#141413]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#F0EFEA] mt-6 flex flex-col gap-2.5">
                    {prod.slug === 'sagitta' && (
                      <Link to="/trabajos/sagitta">
                        <Button variant="outline" size="sm" className="w-full justify-center">
                          Ver caso de estudio
                        </Button>
                      </Link>
                    )}
                    {prod.ctaUrl && (
                      <a
                        href={prod.ctaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-[#5C5B56] hover:text-[#141413] rounded-lg border border-[#E5E3DC] hover:bg-[#F5F4EF] transition-colors"
                      >
                        <span>Repositorio y Demo Satélite</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <Link to="/contacto">
                      <Button variant="primary" size="sm" className="w-full justify-center">
                        Solicitar demostración
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. Proceso de Trabajo y Metodología */}
      {isSectionVisible('process') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#141413] text-white rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="max-w-2xl mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#E07A5F] mb-2 block">
                Metodología de Trabajo
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-editorial-heading">
                Cómo trabajamos de principio a fin
              </h2>
              <p className="text-xs sm:text-sm text-[#8A8881] mt-2 leading-relaxed">
                Un proceso riguroso donde cada decisión técnica se justifica, se prueba con datos reales y se documenta para garantizar autonomía a largo plazo.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(
                cmsContent.processSteps || [
                  {
                    step: '01',
                    title: 'Auditoría & Alcance',
                    description:
                      'Examinamos los requisitos reales, limitaciones operativas y modelos de datos antes de comprometer líneas de código.',
                  },
                  {
                    step: '02',
                    title: 'Arquitectura & Sistema',
                    description:
                      'Diseñamos tokens tipográficos, contratos de datos tipados y bases de componentes accesibles para máxima velocidad.',
                  },
                  {
                    step: '03',
                    title: 'Construcción Modular',
                    description:
                      'Desarrollamos por fases independientes y comprobables con suites de prueba automatizadas en cada entrega.',
                  },
                  {
                    step: '04',
                    title: 'Auditoría & Despliegue',
                    description:
                      'Revisiones de seguridad CSP, rendimiento Core Web Vitals y verificación de accesibilidad antes de publicar.',
                  },
                ]
              ).map((item) => (
                <div key={item.step} className="p-6 rounded-2xl bg-[#201F1D] border border-[#2A2926]">
                  <span className="text-2xl font-mono font-bold text-[#E07A5F] block mb-2">{item.step}</span>
                  <h4 className="text-sm font-bold text-white mb-1.5">{item.title}</h4>
                  <p className="text-xs text-[#8A8881] leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. CTA Final Honesto */}
      {isSectionVisible('cta') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto space-y-5 bg-white p-8 sm:p-12 rounded-3xl border border-[#E5E3DC] shadow-[0_12px_40px_rgba(20,20,19,0.04)]">
            <div className="w-12 h-12 rounded-2xl bg-[#F5F4EF] text-[#C85A32] flex items-center justify-center mx-auto">
              <Globe className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#141413] font-editorial-heading">
              {cmsContent.ctaHeadline || '¿Tienes un proyecto en mente?'}
            </h2>
            <p className="text-sm text-[#5C5B56] leading-relaxed max-w-xl mx-auto">
              {cmsContent.ctaDescription ||
                'Hablemos con honestidad sobre alcance, viabilidad técnica y soluciones prácticas. Sin presiones comerciales ni presupuestos opacos.'}
            </p>
            <div className="pt-2">
              <Link to="/contacto">
                <Button size="lg" variant="primary" className="rounded-full shadow-md">
                  {cmsContent.ctaButtonText || 'Iniciar conversación'}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
