import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  MonitorSmartphone,
  Workflow,
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
import { projectRepository } from '../../repositories/projectRepository';
import { cmsRepository } from '../../repositories/cmsRepository';
import { FIXTURE_SERVICES, FIXTURE_PRODUCTS } from '../../data/fixtures';

export const HomePage: React.FC = () => {
  const featuredProjects = projectRepository.getFeaturedProjects();
  const showcaseProject =
    featuredProjects.find((project) => project.slug === 'motoindy') || featuredProjects[0];
  const showcaseHref = showcaseProject ? `/trabajos/${showcaseProject.slug}` : '/trabajos';
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
    eyebrow: 'Soluciones digitales hechas para personas y negocios',
    headline: 'Tu negocio merece herramientas que trabajen contigo.',
    description:
      'Organiza mejor el trabajo, atiende a tus clientes con más calma y guarda tiempo para crecer.',
    primaryCtaText: 'Conversar sobre tu proyecto',
    primaryCtaLink: '/contacto',
    secondaryCtaText: 'Explorar trabajos y casos',
    secondaryCtaLink: '/trabajos',
    badges: ['Acompañamiento directo', 'Diseño pensado para personas', 'Soluciones a medida'],
  };

  return (
    <div className="home-page space-y-24 sm:space-y-32 pb-24">
      {/* 1. Hero editorial con una vitrina visual en movimiento */}
      {isSectionVisible('hero') && (
        <section className="home-hero relative isolate overflow-hidden">
          <div className="home-hero-orb home-hero-orb-one" aria-hidden="true" />
          <div className="home-hero-orb home-hero-orb-two" aria-hidden="true" />
          <div className="home-hero-grain" aria-hidden="true" />
          <div className="relative mx-auto grid min-h-[min(780px,calc(100svh-4.5rem))] max-w-[1440px] grid-cols-1 items-center gap-12 px-5 py-20 sm:px-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:px-16 xl:px-24">
            <div className="home-hero-copy relative z-10 max-w-3xl" data-reveal>
              <div className="home-eyebrow">
                <span className="home-eyebrow-dot" />
                <Sparkles className="h-3.5 w-3.5" />
                <span>{hero.eyebrow}</span>
              </div>
              <h1 className="mt-8 max-w-3xl text-[clamp(3rem,6.6vw,6.35rem)] font-medium leading-[0.94] tracking-[-0.065em] text-[#FBF8F2] font-editorial-heading">
                {hero.headline}
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-[#E5DDD1]/80 sm:text-lg sm:leading-8">
                {hero.description}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link to={hero.primaryCtaLink}>
                  <Button size="lg" variant="primary" className="home-hero-primary btn-press">
                    {hero.primaryCtaText}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link
                  to={hero.secondaryCtaLink}
                  className="home-hero-secondary group inline-flex min-h-12 items-center gap-2 rounded-full px-5 text-sm font-semibold text-white/85 transition-all duration-300 hover:bg-white/10 hover:text-white"
                >
                  {hero.secondaryCtaText}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/15 pt-6 text-xs text-[#E5DDD1]/70">
                {hero.badges.map((badge) => (
                  <div key={badge} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#E9A17F]" />
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="home-showcase relative mx-auto w-full max-w-[610px]" data-reveal>
              <div className="home-showcase-halo" aria-hidden="true" />
              <div className="home-showcase-image-wrap">
                <img
                  src={showcaseProject?.thumbnailUrl}
                  alt={showcaseProject?.thumbnailAlt || 'Vista de un proyecto desarrollado por Lyberate'}
                  className="home-showcase-image"
                />
                <div className="home-showcase-image-shade" />
                <div className="home-showcase-topline">
                  <span className="home-showcase-mark"><span /> Lyberate / Estudio</span>
                  <span className="home-showcase-index">01 — 03</span>
                </div>
                <div className="home-showcase-caption">
                  <span className="home-showcase-overline">HECHO PARA EL DÍA A DÍA</span>
                  <h2>{showcaseProject?.name || 'Ideas que toman forma'}</h2>
                  <p>Una experiencia pensada alrededor de las personas que la utilizan.</p>
                </div>
              </div>
              <Link to={showcaseHref} className="home-float-card home-float-card-primary group">
                <span className="home-float-icon"><Globe className="h-5 w-5" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-[#827B71]">Movilidad</span>
                  <span className="mt-1 block text-sm font-semibold text-[#201F1D]">Viajes y entregas</span>
                </span>
                <ArrowRight className="h-4 w-4 text-[#9A4122] transition-transform group-hover:translate-x-1" />
              </Link>
              <div className="home-float-card home-float-card-secondary">
                <span className="home-float-icon home-float-icon-green"><MessageSquare className="h-4 w-4" /></span>
                <span>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-[#827B71]">Seguimiento</span>
                  <span className="mt-1 block text-sm font-semibold text-[#201F1D]">Todo en movimiento</span>
                </span>
              </div>
              <div className="home-showcase-stamp" aria-hidden="true">
                <span>MENOS<br />RUIDO</span>
                <span className="home-stamp-rule" />
                <span>MÁS<br />CLARIDAD</span>
              </div>
            </div>
          </div>
          <div className="home-hero-bottom" aria-hidden="true">
            <span>LYBERATE DIGITAL STUDIO</span>
            <span>DISEÑO · PRODUCTO · ACOMPAÑAMIENTO</span>
            <span>01 / 04</span>
          </div>
        </section>
      )}

      {/* 2. Forma de trabajo explicada sin jerga técnica */}
      {isSectionVisible('ecosystem') && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" data-reveal>
          <SectionHeader
            eyebrow="Un proceso claro"
            title="De una necesidad concreta a una solución que funciona"
            description="Trabajamos contigo en cada paso, con acuerdos claros y avances que puedes revisar."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { number: '01', title: 'Te escuchamos', body: 'Entendemos cómo trabajas, qué te está costando tiempo y qué quieres mejorar.', icon: MessageSquare },
              { number: '02', title: 'Trazamos el camino', body: 'Acordamos prioridades, alcance y próximos pasos antes de empezar.', icon: Workflow },
              { number: '03', title: 'Lo construimos contigo', body: 'Revisas los avances y nos das tu opinión durante todo el proceso.', icon: MonitorSmartphone },
            ].map(({ number, title, body, icon: Icon }) => (
              <article key={number} className="home-process-card group rounded-3xl border border-[#E5E3DC] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#D1CEBF] hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="font-editorial-heading text-3xl text-[#7C3AED]">{number}</span>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F5F3FF] text-[#7C3AED] transition-colors group-hover:bg-[#EDE9FE]"><Icon className="h-5 w-5" /></span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-[#141413]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5C5B56]">{body}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 3. Carrusel / Vitrina de Proyectos Integrado en Inicio */}
      {isSectionVisible('carousel') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <SectionHeader
              eyebrow="Vitrina de Trabajos"
              title="Sistemas y proyectos destacados"
              description="Conoce proyectos y soluciones pensados para resolver necesidades reales."
              className="mb-0"
            />
            <Link
              to="/trabajos"
              className="inline-flex items-center text-xs font-bold text-[#7C3AED] hover:underline gap-1 shrink-0"
            >
              <span>Ver catálogo completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Carrusel manual, accesible y sin cambios inesperados */}
          <ProjectCarousel projects={featuredProjects} />
        </section>
      )}

      {/* 4. Qué podemos construir (Servicios Principales) */}
      {isSectionVisible('services') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-reveal>
          <SectionHeader
            eyebrow="En qué podemos ayudarte"
            title="Soluciones para hacer avanzar tu negocio"
            description="Herramientas prácticas, fáciles de usar y pensadas para acompañar la forma en que ya trabajas."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FIXTURE_SERVICES.map((service, index) => {
              const icons = [MonitorSmartphone, Workflow, ShieldCheck];
              const Icon = icons[index % icons.length];
              return (
                <Card
                  key={service.id}
                  variant="default"
                  className="home-reveal-card flex flex-col justify-between hover:border-[#D1CEBF] transition-colors"
                >
                  <CardHeader>
                    <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] flex items-center justify-center text-[#7C3AED] mb-4">
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
                            <span className="w-1 h-1 rounded-full bg-[#7C3AED]" />
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
                      className="text-xs font-semibold text-[#7C3AED] hover:underline inline-flex items-center gap-1"
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-reveal>
          <SectionHeader
            eyebrow="Productos propios"
            title="Herramientas desarrolladas por Lyberate"
            description="Soluciones creadas para resolver necesidades concretas, con opciones que se ajustan al día a día de tu equipo."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FIXTURE_PRODUCTS.map((prod) => {
              const isDesk = prod.slug.includes('lyberatedesk') || prod.slug.includes('chat');
              return (
                <div
                  key={prod.id}
                  className="home-reveal-card bg-white rounded-3xl border border-[#E5E3DC] p-7 flex flex-col justify-between hover:border-[#D1CEBF] transition-colors relative"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#7C3AED] uppercase tracking-widest bg-[#F5F3FF] px-2.5 py-1 rounded-full border border-purple-200">
                        {isDesk ? 'PRODUCTO SAAS' : 'PRODUCTO ACTIVO'}
                      </span>
                      {isDesk ? (
                        <MessageSquare className="w-4 h-4 text-[#7C3AED]" />
                      ) : (
                        <Layers className="w-4 h-4 text-[#5C5B56]" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-[#141413] font-editorial-heading">
                        {prod.name}
                      </h3>
                      <p className="text-xs font-semibold text-[#7C3AED] mt-0.5">{prod.tagline}</p>
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
                    {prod.ctaUrl && !prod.ctaUrl.includes('github.com') && (
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-reveal>
          <div className="bg-[#141413] text-white rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="max-w-2xl mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#A78BFA] mb-2 block">
                Metodología de Trabajo
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-editorial-heading">
                Cómo trabajamos de principio a fin
              </h2>
              <p className="text-xs sm:text-sm text-[#8A8881] mt-2 leading-relaxed">
                Un proceso claro, con decisiones conversadas y avances que puedes revisar a lo largo del proyecto.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(
                cmsContent.processSteps || [
                  {
                    step: '01',
                    title: 'Te escuchamos',
                    description:
                      'Entendemos tus objetivos, prioridades y la forma en que trabaja tu equipo.',
                  },
                  {
                    step: '02',
                    title: 'Trazamos el camino',
                    description:
                      'Acordamos una solución a medida, con alcance claro y próximos pasos definidos.',
                  },
                  {
                    step: '03',
                    title: 'Lo construimos contigo',
                    description:
                      'Compartimos avances para que puedas revisar y opinar durante el proceso.',
                  },
                  {
                    step: '04',
                    title: 'Te acompañamos',
                    description:
                      'Te ayudamos a poner en marcha la solución y resolver tus dudas.',
                  },
                ]
              ).map((item) => (
                <div key={item.step} className="p-6 rounded-2xl bg-[#201F1D] border border-[#2A2926]">
                  <span className="text-2xl font-mono font-bold text-[#A78BFA] block mb-2">{item.step}</span>
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
            <div className="w-12 h-12 rounded-2xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center mx-auto">
              <Globe className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#141413] font-editorial-heading">
              {cmsContent.ctaHeadline || '¿Tienes un proyecto en mente?'}
            </h2>
            <p className="text-sm text-[#5C5B56] leading-relaxed max-w-xl mx-auto">
              {cmsContent.ctaDescription ||
                'Hablemos con honestidad sobre lo que necesitas, las opciones disponibles y los próximos pasos. Sin presiones ni presupuestos opacos.'}
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
