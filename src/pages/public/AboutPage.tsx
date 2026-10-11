import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  MessageSquare,
  Globe,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { cmsRepository } from '../../repositories/cmsRepository';
import { profileRepository } from '../../repositories/profileRepository';

export const AboutPage: React.FC = () => {
  const cmsContent = cmsRepository.getPageContent('about');
  const founders = profileRepository.getProfiles();

  useEffect(() => {
    if (cmsContent.seo?.metaTitle) {
      document.title = cmsContent.seo.metaTitle;
    }
  }, [cmsContent.seo?.metaTitle]);

  const isSectionVisible = (id: string) => {
    const sec = cmsContent.sectionsConfig?.find((s) => s.id === id);
    return sec ? sec.isVisible : true;
  };

  const story = cmsContent.aboutStory || {
    eyebrow: 'Sobre Lyberate',
    title: 'Creamos herramientas digitales útiles y fáciles de usar',
    leadParagraph:
      'Somos un equipo que escucha primero y crea herramientas digitales pensando en las personas que las usan cada día.',
    bodyParagraphs: [
      'Cada negocio tiene una manera particular de trabajar. Por eso entendemos el problema contigo y proponemos una solución clara, con prioridades y próximos pasos acordados.',
      'Creamos sitios, herramientas de gestión y productos propios. Durante el proyecto tendrás comunicación directa con las personas que lo llevan adelante.',
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24 sm:space-y-32">
      {/* 1. Encabezado & Declaración de Propósito Editorial */}
      {isSectionVisible('story') && (
        <section className="relative" data-reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F4EF] border border-[#E5E3DC] text-xs font-semibold text-[#7C3AED]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{story.eyebrow}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#141413] leading-[1.12] font-editorial-heading">
                {story.title}
              </h1>

              <p className="text-base sm:text-lg text-[#141413] font-medium leading-relaxed font-editorial-body">
                {story.leadParagraph}
              </p>

              <div className="space-y-4 text-sm text-[#5C5B56] leading-relaxed pt-2">
                {story.bodyParagraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link to="/contacto">
                  <Button size="md" variant="primary">
                    Conversar directamente con nosotros
                  </Button>
                </Link>
                <Link to="/trabajos">
                  <Button size="md" variant="outline">
                    Ver sistemas construidos
                  </Button>
                </Link>
              </div>
            </div>

            {/* Manifiesto Visual con Estética iOS27 */}
            <div className="lg:col-span-5">
              <div className="bg-white p-7 sm:p-8 rounded-3xl border border-[#E5E3DC] shadow-[0_12px_40px_rgba(20,20,19,0.06)] space-y-6 relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-[#F0EFEA]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#7C3AED]" />
                    <div className="w-3 h-3 rounded-full bg-[#D1CEBF]" />
                    <div className="w-3 h-3 rounded-full bg-[#E5E3DC]" />
                  </div>
                  <span className="text-[11px] font-mono text-[#8A8881]">lyberate.manifesto</span>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#E5E3DC] space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8881] block">
                      01 / Pensado para tu negocio
                    </span>
                    <p className="text-[#141413] font-medium leading-relaxed">
                      Diseñamos cada experiencia alrededor de las personas, las tareas y las prioridades de tu equipo.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#E5E3DC] space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8881] block">
                      02 / Comunicación directa
                    </span>
                    <p className="text-[#141413] font-medium leading-relaxed">
                      Conversas con el equipo que conoce tu proyecto y puede acompañarte en cada etapa.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#E5E3DC] space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8881] block">
                      03 / Claridad y autonomía
                    </span>
                    <p className="text-[#141413] font-medium leading-relaxed">
                      Explicamos las decisiones y te ayudamos a entender cómo aprovechar las herramientas que construimos.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 py-2.5 px-4 rounded-xl border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Un equipo cercano, enfocado en resultados</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Los Socios Fundadores: Valdez & Socio Fundador (Estética iOS27) */}
      {isSectionVisible('team') && (
        <section className="space-y-10" data-reveal>
          <SectionHeader
            eyebrow="Socios Fundadores & Liderazgo"
            title="Quienes construimos y respaldamos cada proyecto"
            description="Dos perfiles complementarios, unidos por el cuidado en los detalles y el acompañamiento cercano."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {founders.map((founder) => (
              <div
                key={founder.id}
                className="bg-white rounded-3xl border border-[#E5E3DC] p-8 sm:p-10 shadow-[0_12px_40px_rgba(20,20,19,0.04)] hover:border-[#D1CEBF] transition-all flex flex-col justify-between relative group"
              >
                <div className="space-y-6">
                  {/* Avatar con Aro de Marca Distintivo iOS27 */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-5">
                      <div
                        className="w-20 h-20 rounded-full overflow-hidden bg-[#141413] shrink-0 border-2 border-white shadow-md relative"
                        style={{
                          boxShadow:
                            founder.id === 'valdez'
                              ? '0 0 0 3px #FBFBF9, 0 0 0 6px #7C3AED'
                              : '0 0 0 3px #FBFBF9, 0 0 0 6px #141413',
                        }}
                      >
                        <img
                          src={founder.avatarUrl}
                          alt={`Fotografía oficial de ${founder.name}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7C3AED] block">
                          SOCIO FUNDADOR
                        </span>
                        <h3 className="text-2xl font-extrabold text-[#141413] tracking-tight font-editorial-heading">
                          {founder.name}
                        </h3>
                        <p className="text-xs font-semibold text-[#5C5B56] mt-0.5">
                          {founder.roleTitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Biografía en lenguaje claro */}
                  <p className="text-xs sm:text-sm text-[#5C5B56] leading-relaxed">
                    {founder.bio}
                  </p>

                </div>

                {/* Acciones de Contacto Directo */}
                <div className="pt-6 border-t border-[#F0EFEA] mt-8 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${founder.whatsappNumber.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 hover:bg-emerald-100 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp directo</span>
                    </a>

                    <a
                      href={`mailto:${founder.email}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F4EF] text-[#141413] text-xs font-semibold border border-[#E5E3DC] hover:bg-[#E5E3DC] transition-colors"
                    >
                      <span>{founder.email}</span>
                    </a>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Forma de acompañar a cada cliente */}
      <section className="bg-gradient-to-b from-[#141413] to-[#1C1B18] text-[#F5F4EF] p-8 sm:p-12 rounded-3xl border border-[#2A2926] shadow-2xl" data-reveal>
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#201F1D] border border-[#2A2926] text-xs font-mono text-[#A78BFA] mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Una relación de trabajo clara</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-editorial-heading">
            Cercanía en cada etapa del proyecto
          </h2>
          <p className="text-sm text-[#8A8881] mt-3 leading-relaxed">
            Queremos que sepas qué estamos haciendo, por qué y qué viene después.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            ['01 / ESCUCHA', 'Entendemos tu día a día', 'Conocemos tus objetivos, dificultades y la forma en que trabaja tu equipo.'],
            ['02 / PLAN', 'Acordamos prioridades', 'Definimos juntos el alcance, las etapas y las decisiones importantes.'],
            ['03 / AVANCES', 'Revisas mientras construimos', 'Compartimos avances para que puedas opinar y ajustar a tiempo.'],
            ['04 / ACOMPAÑAMIENTO', 'Seguimos cerca', 'Te ayudamos a poner en marcha la solución y resolver tus dudas.'],
          ].map(([step, title, description]) => (
            <article key={step} className="rounded-2xl border border-[#3E3D38] bg-[#1C1B18]/90 p-6">
              <span className="block text-xs font-semibold tracking-wider text-[#A78BFA]">{step}</span>
              <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-3 text-xs leading-relaxed text-[#A8A69E]">{description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 4. Principios Innegociables de Trabajo */}
      {isSectionVisible('principles') && (
        <section className="space-y-8" data-reveal>
          <SectionHeader
            eyebrow="Nuestros Principios"
            title="Principios que guían nuestro trabajo"
            description="Reglas claras para colaborar con respeto, transparencia y atención al detalle."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Honestidad de Atribución',
                desc: 'Declaramos con exactitud qué es propio, qué pertenece al cliente y cuál fue nuestro aporte real. Nunca inventamos métricas ni premios falsos.',
                icon: ShieldCheck,
              },
              {
                title: 'Simplicidad útil',
                desc: 'Buscamos soluciones fáciles de entender, mantener y usar en las tareas del día a día.',
                icon: CheckCircle2,
              },
              {
                title: 'Diseño para todas las personas',
                desc: 'Cuidamos la claridad, la lectura y el uso cómodo desde distintos dispositivos.',
                icon: Globe,
              },
              {
                title: 'Cuidado de la información',
                desc: 'Tratamos los datos con responsabilidad y explicamos cómo se gestionan.',
                icon: Lock,
              },
              {
                title: 'Arquitectura Desacoplada',
                desc: 'Mantenemos límites claros entre capas para que cada sistema pueda evolucionar o reemplazarse sin colapsar el resto de la empresa.',
                icon: Layers,
              },
              {
                title: 'Diseño Editorial Distintivo',
                desc: 'Hacemos que cada proyecto sea visualmente propio, con tipografía calculada, jerarquía clara y sin aspecto de plantilla genérica de internet.',
                icon: CheckCircle2,
              },
            ].map((principle) => {
              const Icon = principle.icon;
              return (
                <Card key={principle.title} variant="default" className="hover:border-[#D1CEBF] transition-colors">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] flex items-center justify-center text-[#7C3AED] mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-base font-bold text-[#141413]">
                      {principle.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-[#5C5B56] leading-relaxed">{principle.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. Preguntas Frecuentes (FAQ) */}
      {isSectionVisible('faq') && (
        <section className="max-w-4xl mx-auto space-y-8" data-reveal>
          <SectionHeader
            eyebrow="Resolviendo Dudas"
            title="Preguntas frecuentes sobre trabajar con nosotros"
            description="Respuestas honestas a las preguntas que suelen hacerse las empresas antes de iniciar un desarrollo con Lyberate."
          />

          <div className="space-y-4">
            {[
              {
                q: '¿Cómo deciden qué solución necesita mi negocio?',
                a: 'Primero conversamos sobre tus objetivos y tu forma de trabajar. Después te proponemos opciones y acordamos el alcance antes de comenzar.',
              },
              {
                q: '¿Con quién hablaré durante el desarrollo de mi proyecto?',
                a: 'Te comunicarás directamente con los socios que acompañan y llevan adelante cada proyecto.',
              },
              {
                q: '¿Qué diferencia hay entre Centauri y Lyberate?',
                a: 'Lyberate es la marca con la que presentamos nuestro trabajo. Centauri es el nombre que usamos para el espacio interno de gestión.',
              },
              {
                q: '¿Pueden conectar las herramientas que ya utilizamos?',
                a: 'En muchos casos sí. Revisamos las herramientas que ya utilizas y conversamos sobre las opciones para conectarlas sin interrumpir tu operación.',
              },
              {
                q: '¿Puedo conocer los avances antes de que el proyecto esté terminado?',
                a: 'Sí. Acordamos revisiones durante el proyecto para que puedas ver el progreso, compartir comentarios y mantenerte al tanto.',
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="p-6 rounded-2xl bg-white border border-[#E5E3DC] space-y-2 hover:border-[#D1CEBF] transition-colors"
              >
                <div className="flex items-center gap-2 text-[#7C3AED]">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <h4 className="text-sm sm:text-base font-bold text-[#141413]">{faq.q}</h4>
                </div>
                <p className="text-xs sm:text-sm text-[#5C5B56] leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Llamada a la Acción (CTA) Final */}
      <section className="text-center" data-reveal>
        <div className="max-w-2xl mx-auto space-y-5 bg-white p-8 sm:p-12 rounded-3xl border border-[#E5E3DC] shadow-[0_12px_40px_rgba(20,20,19,0.04)]">
          <div className="w-12 h-12 rounded-2xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#141413] font-editorial-heading">
            ¿Tienes una idea que quieres hacer realidad?
          </h2>
          <p className="text-sm text-[#5C5B56] leading-relaxed max-w-xl mx-auto">
            Cuéntanos qué necesitas y conversemos sobre el siguiente paso, el alcance y los tiempos.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link to="/contacto">
              <Button size="lg" variant="primary" className="rounded-full shadow-md">
                Iniciar conversación directa
              </Button>
            </Link>
            <Link to="/trabajos">
              <Button size="lg" variant="outline" className="rounded-full">
                Explorar casos de estudio
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
