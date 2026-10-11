import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  Globe,
  Layers,
  MessageSquare,
  Cpu,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  HelpCircle,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { FIXTURE_SERVICES } from '../../data/fixtures';
import { ServiceDTO } from '../../types';
import { subserviceRepository, type SubserviceDTO } from '../../repositories/subserviceRepository';

export const ServicesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [subservices, setSubservices] = useState<SubserviceDTO[]>(() => subserviceRepository.getPublished());
  const [expandedSubserviceId, setExpandedSubserviceId] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setSubservices(subserviceRepository.getPublished());
    };
    window.addEventListener('lyberate-subservices-update', handleUpdate);
    return () => {
      window.removeEventListener('lyberate-subservices-update', handleUpdate);
    };
  }, []);

  const filteredServices = useMemo(() => {
    if (selectedCategory === 'all') return FIXTURE_SERVICES;
    return FIXTURE_SERVICES.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  const getServiceIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Globe':
        return <Globe className="w-5 h-5" />;
      case 'Layers':
        return <Layers className="w-5 h-5" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24 sm:space-y-32">
      {/* 1. Header Editorial */}
      <section className="max-w-3xl space-y-4" data-reveal>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F4EF] border border-[#E5E3DC] text-xs font-semibold text-[#7C3AED]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Servicios para simplificar tu trabajo</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#141413] leading-[1.12] font-editorial-heading">
          Soluciones digitales pensadas para tu día a día
        </h1>
        <p className="text-base sm:text-lg text-[#5C5B56] leading-relaxed font-editorial-body">
          Creamos soluciones digitales adaptadas a la forma de trabajar de tu empresa, con alcance claro, entregas acordadas y comunicación directa.
        </p>
      </section>

      {/* 2. Filtros de Categorías Accesibles */}
      <section className="space-y-8" data-reveal>
        <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-[#E5E3DC]">
          <span className="text-xs font-semibold text-[#8A8881] mr-2">Categorías:</span>
          {[
            { id: 'all', label: `Todos los servicios (${FIXTURE_SERVICES.length})` },
            { id: 'web', label: 'Sitios web' },
            { id: 'systems', label: 'Ventas y gestión' },
            { id: 'automation', label: 'Atención al cliente' },
            { id: 'integration', label: 'Conectar herramientas' },
            { id: 'maintenance', label: 'Soporte y mantenimiento' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                selectedCategory === cat.id
                  ? 'bg-[#141413] text-white border-[#141413] shadow-xs'
                  : 'bg-white text-[#5C5B56] border-[#E5E3DC] hover:border-[#D1CEBF] hover:text-[#141413]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 3. Listado de Servicios Estructurados */}
        <div className="space-y-12">
          {filteredServices.map((service: ServiceDTO, index: number) => {
            const childSubservices = subservices.filter(
              (sub) => sub.parentServiceId === service.id || sub.parentServiceName.toLowerCase().includes(service.title.toLowerCase().slice(0, 8))
            );

            return (
              <div
                key={service.id}
                data-reveal
                className="bg-white rounded-3xl border border-[#E5E3DC] p-8 sm:p-10 shadow-[0_12px_40px_rgba(20,20,19,0.04)] space-y-8 hover:border-[#D1CEBF] transition-all"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                  {/* Columna Izquierda: Información de Negocio (col-span-7) */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center shrink-0">
                        {getServiceIcon(service.iconName)}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#7C3AED] uppercase tracking-wider block">
                          0{index + 1} — {service.categoryLabel || 'SERVICIO'}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141413] tracking-tight font-editorial-heading">
                          {service.title}
                        </h2>
                      </div>
                    </div>

                    <p className="text-sm text-[#5C5B56] leading-relaxed">
                      {service.summary}
                    </p>

                    {/* Qué necesidad atiende */}
                    <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#E5E3DC] space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8881] block">
                        ¿Cómo puede ayudarte?
                      </span>
                      <p className="text-xs sm:text-sm text-[#141413] font-medium leading-relaxed">
                        {service.problemSolved}
                      </p>
                    </div>

                    {/* Para quién es útil */}
                    <div className="flex items-center gap-2 text-xs text-[#5C5B56]">
                      <strong className="text-[#141413] font-semibold">Ideal para:</strong>
                      <span>{service.targetAudience}</span>
                    </div>

                    {/* Lo que necesitamos para presupuestar */}
                    {service.requirementsToQuote && service.requirementsToQuote.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A8881] block mb-2 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#7C3AED]" />
                          <span>Para preparar una propuesta:</span>
                        </span>
                        <ul className="space-y-1.5 text-xs text-[#5C5B56]">
                          {service.requirementsToQuote.map((req, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-2">
                              <span className="text-[#7C3AED] font-bold shrink-0">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Columna Derecha: Entregables Garantizados & Cotización (col-span-5) */}
                  <div className="lg:col-span-5 bg-[#FBFBF9] p-7 rounded-2xl border border-[#E5E3DC] flex flex-col justify-between h-full space-y-6">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-[#E5E3DC] mb-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#141413]">
                          Qué podemos preparar:
                        </h3>
                        <span className="text-[10px] font-mono text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          SOLUCIÓN A LA MEDIDA
                        </span>
                      </div>

                      <ul className="space-y-3 text-xs text-[#141413]">
                        {service.typicalDeliverables.map((item) => (
                          <li key={item} className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-[#E5E3DC] space-y-3">
                      <div className="flex items-center justify-between text-[11px] text-[#8A8881]">
                        <span>Presupuesto a medida</span>
                        <span className="text-[#141413] font-semibold">Sin costes sorpresa</span>
                      </div>

                      <Link to="/contacto">
                        <Button variant="primary" size="md" className="w-full justify-center gap-2 rounded-xl shadow-xs">
                          <span>Solicitar propuesta para este servicio</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Subservicios Editables desde CMS (si existen para este servicio) */}
                {childSubservices.length > 0 && (
                  <div className="pt-6 border-t border-[#E5E3DC] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#7C3AED]" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#141413]">
                          Especialidades y paquetes específicos ({childSubservices.length})
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono text-[#7C3AED] bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        Gestionable desde Centauri CMS
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {childSubservices.map((sub) => {
                        const isExpanded = expandedSubserviceId === sub.id;

                        return (
                          <div
                            key={sub.id}
                            className="bg-[#FBFBF9] border border-[#E5E3DC] rounded-2xl p-5 hover:border-[#D1CEBF] transition-all space-y-3"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h4 className="text-sm font-bold text-[#141413] font-editorial-heading">
                                  {sub.name}
                                </h4>
                                <p className="text-xs font-medium text-[#7C3AED] mt-0.5">
                                  {sub.tagline}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setExpandedSubserviceId(isExpanded ? null : sub.id)}
                                className="text-[#8A8881] hover:text-[#141413] p-1 rounded-lg transition-colors cursor-pointer"
                                aria-label={isExpanded ? 'Contraer detalles' : 'Expandir detalles'}
                              >
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                            </div>

                            <p className="text-xs text-[#5C5B56] leading-relaxed">
                              {sub.description}
                            </p>

                            {/* Beneficios */}
                            {sub.benefits && sub.benefits.length > 0 && (
                              <div className="space-y-1.5 pt-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8881] block">
                                  Beneficios inmediatos:
                                </span>
                                <ul className="space-y-1 text-xs text-[#5C5B56]">
                                  {sub.benefits.slice(0, isExpanded ? undefined : 2).map((benefit, bIdx) => (
                                    <li key={bIdx} className="flex items-start gap-1.5">
                                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                      <span>{benefit}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Entregables y FAQs en modo expandido */}
                            {isExpanded && (
                              <div className="space-y-3 pt-3 border-t border-[#E5E3DC] text-xs">
                                {sub.deliverables && sub.deliverables.length > 0 && (
                                  <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8881] block mb-1">
                                      Entregables incluidos:
                                    </span>
                                    <ul className="space-y-1 text-[#5C5B56]">
                                      {sub.deliverables.map((deliv, dIdx) => (
                                        <li key={dIdx} className="flex items-start gap-1.5">
                                          <span className="text-[#7C3AED] font-bold">•</span>
                                          <span>{deliv}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {sub.faqs && sub.faqs.length > 0 && (
                                  <div className="space-y-2 pt-2 border-t border-[#E5E3DC]/60">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8881] block">
                                      Preguntas frecuentes:
                                    </span>
                                    {sub.faqs.map((faq, fIdx) => (
                                      <div key={fIdx} className="bg-white p-2.5 rounded-xl border border-[#E5E3DC]">
                                        <p className="font-semibold text-[#141413] text-[11px]">{faq.question}</p>
                                        <p className="text-[#5C5B56] text-[11px] mt-1">{faq.answer}</p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="pt-2 flex items-center justify-between">
                              <Link to={`/contacto?servicio=${encodeURIComponent(sub.name)}`}>
                                <Button size="sm" variant="outline" className="text-xs gap-1.5">
                                  <span>{sub.ctaText || 'Cotizar este subservicio'}</span>
                                  <ArrowRight className="w-3 h-3" />
                                </Button>
                              </Link>
                              <button
                                type="button"
                                onClick={() => setExpandedSubserviceId(isExpanded ? null : sub.id)}
                                className="text-[11px] font-semibold text-[#7C3AED] hover:underline cursor-pointer"
                              >
                                {isExpanded ? 'Ver menos' : 'Ver entregables & FAQs'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Cómo calculamos y ejecutamos un presupuesto */}
      <section className="bg-[#141413] text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-8" data-reveal>
        <div className="max-w-2xl">
          <span className="text-xs font-mono uppercase tracking-widest text-[#A78BFA] font-bold block mb-2">
            Transparencia Comercial
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-editorial-heading">
            Nuestras 4 reglas para cotizar proyectos
          </h2>
          <p className="text-xs sm:text-sm text-[#8A8881] mt-2 leading-relaxed">
            Sin presupuestos abiertos con facturación por horas imprevistas. Trabajamos con alcance cerrado y garantías formales.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              num: '01',
              title: 'Alcance Delimitado',
              desc: 'Acordamos por escrito qué incluye el trabajo y qué recibirás antes de comenzar.',
            },
            {
              num: '02',
              title: 'Pagos por etapas',
              desc: 'Organizamos los pagos junto con avances concretos para que siempre sepas qué esperar.',
            },
            {
              num: '03',
              title: 'Claridad sobre tu proyecto',
              desc: 'Dejamos claro qué materiales, accesos y documentación recibirás al finalizar.',
            },
            {
              num: '04',
              title: 'Sin costos inesperados',
              desc: 'Conversamos contigo sobre gastos de servicios externos antes de tomar decisiones.',
            },
          ].map((item) => (
            <div key={item.num} className="p-6 rounded-2xl bg-[#201F1D] border border-[#2A2926] space-y-2">
              <span className="text-2xl font-mono font-bold text-[#A78BFA] block">{item.num}</span>
              <h3 className="text-sm font-bold text-white">{item.title}</h3>
              <p className="text-xs text-[#8A8881] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CTA Final */}
      <section className="text-center" data-reveal>
        <div className="max-w-2xl mx-auto space-y-5 bg-white p-8 sm:p-12 rounded-3xl border border-[#E5E3DC] shadow-[0_12px_40px_rgba(20,20,19,0.04)]">
          <div className="w-12 h-12 rounded-2xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#141413] font-editorial-heading">
            ¿Tienes un requerimiento específico?
          </h2>
          <p className="text-sm text-[#5C5B56] leading-relaxed max-w-xl mx-auto">
            Cuéntanos qué quieres mejorar. Revisamos contigo las opciones, los tiempos y los próximos pasos, sin compromiso.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link to="/contacto">
              <Button size="lg" variant="primary" className="rounded-full shadow-md">
                Hablar sobre mi proyecto
              </Button>
            </Link>
            <Link to="/productos">
              <Button size="lg" variant="outline" className="rounded-full">
                Ver productos comercializables
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

