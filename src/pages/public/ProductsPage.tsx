import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  Layers,
  MessageSquare,
  Newspaper,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Clock,
  Zap,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { FIXTURE_PRODUCTS } from '../../data/fixtures';
import { ProductDTO } from '../../types';

export const ProductsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'saas' | 'enterprise'>('all');

  const filteredProducts = FIXTURE_PRODUCTS.filter((prod) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'saas') return prod.pricingModel === 'saas';
    if (activeTab === 'enterprise') return prod.pricingModel === 'license' || prod.pricingModel === 'hybrid';
    return true;
  });

  const getProductIcon = (slug: string) => {
    if (slug.includes('sagitta')) return <Layers className="w-6 h-6 text-[#7C3AED]" />;
    if (slug.includes('desk') || slug.includes('chat')) return <MessageSquare className="w-6 h-6 text-[#7C3AED]" />;
    return <Newspaper className="w-6 h-6 text-[#7C3AED]" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'available') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Disponible para implantación</span>
        </span>
      );
    }
    if (status === 'beta') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>Beta activa / Demo disponible</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F5F4EF] text-[#5C5B56] border border-[#E5E3DC]">
        <span>En desarrollo</span>
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24 sm:space-y-32">
      {/* 1. Header Editorial */}
      <section className="max-w-3xl space-y-4" data-reveal>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F4EF] border border-[#E5E3DC] text-xs font-semibold text-[#7C3AED]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Herramientas para hacer crecer tu negocio</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#141413] leading-[1.12] font-editorial-heading">
          Herramientas digitales listas para ayudar a tu negocio
        </h1>
        <p className="text-base sm:text-lg text-[#5C5B56] leading-relaxed font-editorial-body">
          Herramientas para resolver tareas concretas, creadas con cuidado y acompañamiento directo de sus responsables.
        </p>
      </section>

      {/* 2. Filtros de Modelo de Producto */}
      <section className="space-y-10" data-reveal>
        <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-[#E5E3DC]">
          <span className="text-xs font-semibold text-[#8A8881] mr-2">Modalidad:</span>
          {[
            { id: 'all', label: `Todos los productos (${FIXTURE_PRODUCTS.length})` },
            { id: 'saas', label: 'Atención al cliente' },
            { id: 'enterprise', label: 'Gestión y contenido' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as 'all' | 'saas' | 'enterprise')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                activeTab === tab.id
                  ? 'bg-[#141413] text-white border-[#141413] shadow-xs'
                  : 'bg-white text-[#5C5B56] border-[#E5E3DC] hover:border-[#D1CEBF] hover:text-[#141413]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 3. Fichas de Producto Detalladas */}
        <div className="space-y-12" data-reveal>
          {filteredProducts.map((prod: ProductDTO) => {
            const isDesk = prod.slug.includes('lyberatedesk');

            return (
              <div
                key={prod.id}
                className="bg-white rounded-3xl border border-[#E5E3DC] p-8 sm:p-12 shadow-[0_12px_40px_rgba(20,20,19,0.04)] space-y-8 hover:border-[#D1CEBF] transition-all"
              >
                {/* Cabecera de Ficha */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#F0EFEA]">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#F5F3FF] flex items-center justify-center shrink-0 border border-purple-200">
                      {getProductIcon(prod.slug)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold text-[#7C3AED] uppercase tracking-wider">
                          {isDesk ? 'ATENCIÓN AL CLIENTE' : 'HERRAMIENTA DE NEGOCIO'}
                        </span>
                        <span className="text-[#8A8881]">•</span>
                        <span className="text-xs font-semibold text-[#5C5B56]">
                          {prod.pricingNote}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141413] tracking-tight font-editorial-heading">
                        {prod.name}
                      </h2>
                      <p className="text-sm font-semibold text-[#7C3AED] mt-1">
                        {prod.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {getStatusBadge(prod.status)}
                  </div>
                </div>

                {/* Resumen & Valor de Negocio */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7 space-y-5">
                    <p className="text-sm text-[#5C5B56] leading-relaxed">
                      {prod.summary}
                    </p>

                    {prod.targetBusiness && (
                      <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#E5E3DC]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8881] block mb-1">
                          ¿Para quién está diseñado?
                        </span>
                        <p className="text-xs sm:text-sm text-[#141413] font-medium leading-normal">
                          {prod.targetBusiness}
                        </p>
                      </div>
                    )}

                    {/* Acciones principales */}
                    <div className="pt-4 flex flex-wrap gap-4">
                      {prod.slug === 'sagitta' && (
                        <Link to="/trabajos/sagitta">
                          <Button variant="primary" size="md" className="gap-2 rounded-xl">
                            <span>Ver caso de estudio & capturas</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      )}
                      {prod.demoUrl && !prod.demoUrl.includes('github.com') && (
                        <a
                          href={prod.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E5E3DC] bg-white hover:bg-[#F5F4EF] text-xs font-bold text-[#141413] transition-colors"
                        >
                          <Zap className="w-4 h-4 text-[#7C3AED]" />
                          <span>Ver demostración del producto</span>
                          <ExternalLink className="w-3.5 h-3.5 text-[#8A8881]" />
                        </a>
                      )}
                      <Link to="/contacto">
                        <Button variant="outline" size="md" className="rounded-xl">
                          Pedir demostración guiada
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Capacidades Verificadas en Código (col-span-5) */}
                  <div className="lg:col-span-5 bg-[#FBFBF9] p-6 sm:p-7 rounded-2xl border border-[#E5E3DC] space-y-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A8881] block">
                    Lo que puedes hacer:
                    </span>
                    <ul className="space-y-3 text-xs text-[#141413]">
                      {prod.verifiedFeatures.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sub-sección de Planes para Productos SaaS (LyberateDesk) */}
                {prod.plans && prod.plans.length > 0 && (
                  <div className="pt-8 border-t border-[#F0EFEA] space-y-6">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C3AED] block mb-1">
                        MODELO SAAS POR SUSCRIPCIÓN
                      </span>
                      <h3 className="text-xl font-bold text-[#141413] tracking-tight font-editorial-heading">
                        Planes comerciales de LyberateDesk
                      </h3>
                      <p className="text-xs text-[#5C5B56] mt-0.5">
                        Elige el plan que se adapte al volumen de conversaciones de tu negocio. Sin contratos forzosos.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {prod.plans.map((plan) => (
                        <div
                          key={plan.name}
                          className={`rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                            plan.isHighlighted
                              ? 'bg-white border-[#7C3AED] shadow-md ring-2 ring-[#7C3AED]/20'
                              : 'bg-[#FBFBF9] border-[#E5E3DC] hover:border-[#D1CEBF]'
                          }`}
                        >
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-base font-bold text-[#141413]">{plan.name}</h4>
                              {plan.isHighlighted && (
                                <span className="text-[10px] font-mono font-bold text-[#7C3AED] bg-[#F5F3FF] px-2 py-0.5 rounded-full border border-purple-200">
                                  MÁS POPULAR
                                </span>
                              )}
                            </div>

                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-extrabold text-[#141413] font-mono">
                                ${plan.priceUsd}
                              </span>
                              <span className="text-xs text-[#5C5B56]">USD / {plan.interval}</span>
                            </div>

                            <ul className="space-y-2 pt-2 border-t border-[#E5E3DC]/60 text-xs text-[#141413]">
                              {plan.features.map((item) => (
                                <li key={item} className="flex items-start gap-2">
                                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-6 mt-6 border-t border-[#E5E3DC]/60">
                            <Link to="/contacto">
                              <Button
                                variant={plan.isHighlighted ? 'primary' : 'outline'}
                                size="sm"
                                className="w-full justify-center rounded-xl"
                              >
                                Suscribirme a {plan.name}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Comparativa: Producto Propio vs Desarrollo a Medida */}
      <section className="bg-[#141413] text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-8" data-reveal>
        <div className="max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-widest text-[#A78BFA] font-bold block mb-2">
            Orientación al Cliente
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-editorial-heading">
            ¿Te conviene una herramienta lista o una solución a tu medida?
          </h2>
          <p className="text-xs sm:text-sm text-[#8A8881] mt-2 leading-relaxed">
            Te ayudamos a elegir el camino más práctico. Si una de nuestras herramientas ya resuelve tu necesidad, no tienes que empezar desde cero.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-7 rounded-2xl bg-[#201F1D] border border-[#2A2926] space-y-4">
            <div className="flex items-center gap-2 text-[#A78BFA]">
              <Clock className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Elige un Producto Propio si:</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-[#C5C3BC]">
              <li className="flex items-start gap-2">
                <span className="text-[#A78BFA] font-bold">•</span>
                <span>Necesitas poner en marcha tu punto de venta o atención por WhatsApp de forma inmediata.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#A78BFA] font-bold">•</span>
                <span>Buscas una solución que puedas adaptar a tu catálogo y a la forma de trabajar de tu equipo.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#A78BFA] font-bold">•</span>
                <span>Prefieres conocer de antemano el coste y empezar con algo ya preparado.</span>
              </li>
            </ul>
          </div>

          <div className="p-7 rounded-2xl bg-[#201F1D] border border-[#2A2926] space-y-4">
            <div className="flex items-center gap-2 text-[#7C3AED]">
              <Layers className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Elige un Desarrollo a Medida si:</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-[#C5C3BC]">
              <li className="flex items-start gap-2">
                <span className="text-[#7C3AED] font-bold">•</span>
                <span>Tu modelo operativo tiene flujos únicos que ninguna plataforma existente en el mercado cubre.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#7C3AED] font-bold">•</span>
                <span>Necesitas que la solución se adapte a procesos propios de tu negocio.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#7C3AED] font-bold">•</span>
                <span>Necesitas acordar claramente la entrega y propiedad del trabajo realizado.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. CTA Final */}
      <section className="text-center" data-reveal>
        <div className="max-w-2xl mx-auto space-y-5 bg-white p-8 sm:p-12 rounded-3xl border border-[#E5E3DC] shadow-[0_12px_40px_rgba(20,20,19,0.04)]">
          <div className="w-12 h-12 rounded-2xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center mx-auto">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#141413] font-editorial-heading">
            ¿Quieres probar una de nuestras plataformas?
          </h2>
          <p className="text-sm text-[#5C5B56] leading-relaxed max-w-xl mx-auto">
            Podemos coordinar una demostración en vivo con datos adaptados al sector de tu negocio o habilitar acceso de prueba.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link to="/contacto">
              <Button size="lg" variant="primary" className="rounded-full shadow-md">
                Solicitar demostración
              </Button>
            </Link>
            <Link to="/servicios">
              <Button size="lg" variant="outline" className="rounded-full">
                Ver servicios a medida
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
