import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Cpu,
  Lock,
  MessageSquare,
  Globe,
  Layers,
  Terminal,
  HelpCircle,
  ExternalLink,
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
    eyebrow: 'Sobre Nosotros & Filosofía',
    title: 'Ingeniería de software con criterio, arquitectura sólida y presencia memorable',
    leadParagraph:
      'Lyberate nace de la visión conjunta de dos profesionales full-stack con una convicción innegociable: las organizaciones serias merecen software hecho a su medida, sin plantillas prefabricadas, sin dependencias frágiles y con absoluta transparencia técnica.',
    bodyParagraphs: [
      'Rechazamos de raíz el modelo de agencia tradicional que revende plantillas lentas de WordPress o sistemas SaaS cerrados donde el cliente nunca es dueño de su plataforma. Nosotros diseñamos, estructuramos y programamos cada componente desde sus cimientos para garantizar velocidad de carga instantánea, autonomía operativa y seguridad perimetral.',
      'Trabajamos tanto en el desarrollo de productos propios de alta especialización (como Sagitta para punto de venta e inventarios, y LyberateDesk para atención al cliente multicanal) como en desarrollos a medida para empresas que necesitan sistemas financieros, comerciales, editoriales y de movilidad que nunca se caigan.',
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24 sm:space-y-32">
      {/* 1. Encabezado & Declaración de Propósito Editorial */}
      {isSectionVisible('story') && (
        <section className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F4EF] border border-[#E5E3DC] text-xs font-semibold text-[#C85A32]">
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
                    <div className="w-3 h-3 rounded-full bg-[#C85A32]" />
                    <div className="w-3 h-3 rounded-full bg-[#D1CEBF]" />
                    <div className="w-3 h-3 rounded-full bg-[#E5E3DC]" />
                  </div>
                  <span className="text-[11px] font-mono text-[#8A8881]">lyberate.manifesto</span>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#E5E3DC] space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8881] block">
                      01 / Cero Plantillas Genéricas
                    </span>
                    <p className="text-[#141413] font-medium leading-relaxed">
                      Cada línea de código y cada pantalla responden al modelo de negocio particular de tu empresa. Sin diseños enlatados.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#E5E3DC] space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8881] block">
                      02 / Comunicación Directa con Creadores
                    </span>
                    <p className="text-[#141413] font-medium leading-relaxed">
                      Hablas directamente con quienes diseñan y programan tu software, sin ejecutivos de ventas que prometen imposibles.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#E5E3DC] space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8881] block">
                      03 / Soberanía e Independencia
                    </span>
                    <p className="text-[#141413] font-medium leading-relaxed">
                      Tu empresa es dueña de su información y de su arquitectura. Diseñamos con código estándar sin ataduras artificiales.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 py-2.5 px-4 rounded-xl border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Equipo senior full-stack enfocado en resultados</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Los Socios Fundadores: Valdez & Socio Fundador (Estética iOS27) */}
      {isSectionVisible('team') && (
        <section className="space-y-10">
          <SectionHeader
            eyebrow="Socios Fundadores & Liderazgo"
            title="Quienes construimos y respaldamos cada proyecto"
            description="Dos perfiles complementarios que aúnan la alta arquitectura de software, la gestión de operaciones y el diseño de producto con experiencia de usuario real."
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
                              ? '0 0 0 3px #FBFBF9, 0 0 0 6px #C85A32'
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
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C85A32] block">
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

                  {/* Especialidades Full-Stack */}
                  <div className="space-y-2 pt-2 border-t border-[#F0EFEA]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A8881] block">
                      Especialidades & Competencias:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {founder.specialties.map((spec) => (
                        <span
                          key={spec}
                          className="text-[11px] font-medium text-[#141413] bg-[#F5F4EF] px-3 py-1 rounded-full border border-[#E5E3DC]"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
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

                  {founder.githubUrl && (
                    <a
                      href={founder.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-[#8A8881] hover:text-[#141413] inline-flex items-center gap-1 transition-colors"
                    >
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Stack Tecnológico & Radar de Ingeniería Full-Stack */}
      <section className="bg-gradient-to-b from-[#141413] to-[#1C1B18] text-[#F5F4EF] p-8 sm:p-12 rounded-3xl border border-[#2A2926] shadow-2xl">
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#201F1D] border border-[#2A2926] text-xs font-mono text-[#E07A5F] mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>Arquitectura Sin Concesiones</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-editorial-heading">
            El stack de alta precisión con el que construimos
          </h2>
          <p className="text-sm text-[#8A8881] mt-3 leading-relaxed">
            Elegimos tecnologías con tipado estricto, despliegue global instantáneo y capacidades sin conexión a internet. Sin librerías pesadas ni código improvisado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Col 1 */}
          <div className="bg-[#1C1B18]/90 p-6 rounded-2xl border border-[#3E3D38] flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-mono text-[#C85A32] font-bold block">01 / FRONTEND</span>
              <h3 className="text-lg font-bold text-white">React 19 & TypeScript</h3>
              <p className="text-xs text-[#8A8881] leading-relaxed">
                Tipado estricto al 100%, Tailwind CSS v4 y diseño bespoke con estética iOS27. Carga en milisegundos con cero renderizados redundantes.
              </p>
            </div>
            <div className="pt-4 border-t border-[#2A2926] flex flex-wrap gap-1.5 text-[10px] font-mono text-[#C5C3BC] mt-4">
              <span className="bg-[#2A2926] px-2 py-0.5 rounded">React 19</span>
              <span className="bg-[#2A2926] px-2 py-0.5 rounded">TS 5.7</span>
              <span className="bg-[#2A2926] px-2 py-0.5 rounded">Tailwind v4</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="bg-[#1C1B18]/90 p-6 rounded-2xl border border-[#3E3D38] flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-mono text-[#C85A32] font-bold block">02 / EDGE & APIS</span>
              <h3 className="text-lg font-bold text-white">Cloudflare Edge & Workers</h3>
              <p className="text-xs text-[#8A8881] leading-relaxed">
                Computación distribuida perimetral con firmas criptográficas HMAC SHA-256, políticas de reintento exponencial y latencia inferior a 50ms.
              </p>
            </div>
            <div className="pt-4 border-t border-[#2A2926] flex flex-wrap gap-1.5 text-[10px] font-mono text-[#C5C3BC] mt-4">
              <span className="bg-[#2A2926] px-2 py-0.5 rounded">Cloudflare</span>
              <span className="bg-[#2A2926] px-2 py-0.5 rounded">HMAC SHA-256</span>
              <span className="bg-[#2A2926] px-2 py-0.5 rounded">Webhooks</span>
            </div>
          </div>

          {/* Col 3 */}
          <div className="bg-[#1C1B18]/90 p-6 rounded-2xl border border-[#3E3D38] flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-mono text-[#C85A32] font-bold block">03 / DATOS & OFFLINE</span>
              <h3 className="text-lg font-bold text-white">PostgreSQL & SQLite Sync</h3>
              <p className="text-xs text-[#8A8881] leading-relaxed">
                Arquitectura offline-first garantizada: tus puntos de venta y portales continúan cobrando y funcionando aún sin conexión a internet.
              </p>
            </div>
            <div className="pt-4 border-t border-[#2A2926] flex flex-wrap gap-1.5 text-[10px] font-mono text-[#C5C3BC] mt-4">
              <span className="bg-[#2A2926] px-2 py-0.5 rounded">PostgreSQL</span>
              <span className="bg-[#2A2926] px-2 py-0.5 rounded">SQLite Sync</span>
              <span className="bg-[#2A2926] px-2 py-0.5 rounded">IndexedDB</span>
            </div>
          </div>

          {/* Col 4 */}
          <div className="bg-[#1C1B18]/90 p-6 rounded-2xl border border-[#3E3D38] flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-mono text-[#C85A32] font-bold block">04 / SEGURIDAD & TDD</span>
              <h3 className="text-lg font-bold text-white">RBAC & Vitest TDD</h3>
              <p className="text-xs text-[#8A8881] leading-relaxed">
                Suites de pruebas automatizadas al 100%, control de acceso basado en roles por privilegio mínimo y cabeceras de blindaje CSP L3 / HSTS.
              </p>
            </div>
            <div className="pt-4 border-t border-[#2A2926] flex flex-wrap gap-1.5 text-[10px] font-mono text-[#C5C3BC] mt-4">
              <span className="bg-[#2A2926] px-2 py-0.5 rounded">RBAC Mínimo</span>
              <span className="bg-[#2A2926] px-2 py-0.5 rounded">Vitest 3</span>
              <span className="bg-[#2A2926] px-2 py-0.5 rounded">CSP & HSTS</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Principios Innegociables de Trabajo */}
      {isSectionVisible('principles') && (
        <section className="space-y-8">
          <SectionHeader
            eyebrow="Nuestros Principios"
            title="Criterios éticos y técnicos no negociables"
            description="Reglas claras que rigen cada línea de código, cada contrato y cada entrega que realizamos."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Honestidad de Atribución',
                desc: 'Declaramos con exactitud qué es propio, qué pertenece al cliente y cuál fue nuestro aporte real. Nunca inventamos métricas ni premios falsos.',
                icon: ShieldCheck,
              },
              {
                title: 'Cero Bloatware',
                desc: 'No añadimos librerías ni frameworks pesados sin justificación técnica demostrable de beneficio, mantenimiento y licencia.',
                icon: Cpu,
              },
              {
                title: 'Accesibilidad Universal (WCAG)',
                desc: 'Diseñamos interfaces totalmente navegables por teclado, con contraste de color superior a 7:1 y respeto estricto por movimiento reducido.',
                icon: Globe,
              },
              {
                title: 'Seguridad en el Servidor',
                desc: 'El servidor es la única fuente de autoridad para permisos, sesiones y validaciones. Cero secretos en clientes o repositorios.',
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
                icon: Code2,
              },
            ].map((principle) => {
              const Icon = principle.icon;
              return (
                <Card key={principle.title} variant="default" className="hover:border-[#D1CEBF] transition-colors">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-xl bg-[#F5F4EF] flex items-center justify-center text-[#C85A32] mb-3">
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
        <section className="max-w-4xl mx-auto space-y-8">
          <SectionHeader
            eyebrow="Resolviendo Dudas"
            title="Preguntas frecuentes sobre trabajar con nosotros"
            description="Respuestas honestas a las preguntas que suelen hacerse las empresas antes de iniciar un desarrollo con Lyberate."
          />

          <div className="space-y-4">
            {[
              {
                q: '¿Por qué no utilizan WordPress o plantillas prefabricadas de SaaS?',
                a: 'Las plantillas genéricas sufren de código inflado, vulnerabilidades constantes de plugins de terceros y caídas de rendimiento inaceptables. Construimos con React 19 y arquitectura a medida para que tu plataforma cargue en milisegundos, sea 100% tuya y nunca dependa de las limitaciones de un creador visual genérico.',
              },
              {
                q: '¿Con quién hablaré durante el desarrollo de mi proyecto?',
                a: 'Hablarás directamente con Valdez y su socio fundador. No delegamos la comunicación técnica en gestores comerciales sin conocimientos de programación. Quienes te atienden son los mismos ingenieros responsables de la arquitectura de tu software.',
              },
              {
                q: '¿Qué diferencia hay entre Centauri y Lyberate?',
                a: 'Centauri es el nombre en clave de la arquitectura central de ingeniería, la infraestructura privada y el Control Room de gobernanza. Lyberate es la marca pública oficial del estudio y la cara visible de nuestros productos y servicios comerciales.',
              },
              {
                q: '¿Pueden integrar nuestro nuevo software con nuestros sistemas actuales?',
                a: 'Absolutamente. Diseñamos adaptadores desacoplados y webhooks seguros para conectarnos con bases de datos SQL existentes, pasarelas de pago, WhatsApp Cloud API o servicios legados sin necesidad de tirar abajo la infraestructura que ya funciona.',
              },
              {
                q: '¿Cómo garantizan que el sistema no se caiga si se corta internet?',
                a: 'Para sistemas de caja y gestión crítica (como Sagitta), implementamos arquitectura offline-first con SQLite o IndexedDB local. Tu negocio puede seguir cobrando y despachando sin internet, y cuando la red vuelve, los datos se sincronizan automáticamente con el servidor.',
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="p-6 rounded-2xl bg-white border border-[#E5E3DC] space-y-2 hover:border-[#D1CEBF] transition-colors"
              >
                <div className="flex items-center gap-2 text-[#C85A32]">
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
      <section className="text-center">
        <div className="max-w-2xl mx-auto space-y-5 bg-white p-8 sm:p-12 rounded-3xl border border-[#E5E3DC] shadow-[0_12px_40px_rgba(20,20,19,0.04)]">
          <div className="w-12 h-12 rounded-2xl bg-[#F5F4EF] text-[#C85A32] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#141413] font-editorial-heading">
            ¿Preparado para construir software con criterio?
          </h2>
          <p className="text-sm text-[#5C5B56] leading-relaxed max-w-xl mx-auto">
            Evaluamos tu proyecto de forma transparente. Hablemos de requerimientos técnicos, tiempos reales de entrega y presupuesto sin sorpresas.
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
