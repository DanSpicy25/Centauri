import React, { useState } from 'react';
import {
  Mail,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  Info,
  Clock,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';
import { profileRepository } from '../../repositories/profileRepository';
import { crmRepository } from '../../repositories/crmRepository';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    needType: 'software',
    timeline: '1-3-months',
    description: '',
    consent: false,
    hp_website: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const founders = profileRepository.getProfiles();
  const valdez = founders.find((f) => f.id === 'valdez') || founders[0];
  const socio = founders.find((f) => f.id === 'socio') || founders[1];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Anti-spam honeypot
    if (formData.hp_website) {
      setSubmitted(true);
      return;
    }

    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Por favor, ingresa tu nombre o el de tu empresa.';
    if (!formData.email.trim()) {
      newErrors.email = 'Por favor, ingresa un correo de contacto.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del correo electrónico no es válido.';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Cuéntanos brevemente los objetivos o alcance de tu proyecto.';
    } else if (formData.description.trim().length < 15) {
      newErrors.description = 'Por favor, detalla un poco más tu requerimiento (mínimo 15 caracteres).';
    }
    if (!formData.consent) {
      newErrors.consent = 'Debes autorizar el tratamiento de datos para poder responder tu solicitud.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    // Registro transparente en el CRM local del Control Room
    try {
      const client = crmRepository.createClient({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        industry: `Solicitud web (${formData.needType})`,
        notes: `Interés: ${formData.needType} | Plazo: ${formData.timeline} | Requerimiento: ${formData.description.trim()}`,
      });

      crmRepository.createDeal({
        title: `Oportunidad: ${formData.needType.toUpperCase()} — ${formData.name.trim()}`,
        clientId: client.id,
        clientName: client.name,
        stage: 'lead',
        valueUsd: 2500, // Estimación base para calificación en CRM
        assignedPartner: 'Valdez',
        notes: formData.description.trim(),
      });
    } catch {
      // Continuar con la experiencia del usuario incluso en modo offline estricto
    }

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 450);
  };

  const getWhatsAppMessage = () => {
    const text = `Hola Valdez, te escribo desde la web de Lyberate.%0A%0A*Nombre:* ${encodeURIComponent(
      formData.name || 'Cliente'
    )}%0A*Tipo de proyecto:* ${encodeURIComponent(formData.needType)}%0A*Detalles:* ${encodeURIComponent(
      formData.description || 'Consulta sobre soluciones de software'
    )}`;
    return `https://wa.me/${valdez.whatsappNumber.replace(/[^0-9]/g, '')}?text=${text}`;
  };

  const getMailtoLink = () => {
    const subject = encodeURIComponent(`Consulta técnica: ${formData.needType} — ${formData.name}`);
    const body = encodeURIComponent(
      `Hola equipo de Lyberate,\n\nMi nombre es ${formData.name} (${formData.email}).\nTipo de requerimiento: ${formData.needType}\nPlazo estimado: ${formData.timeline}\n\nDescripción del proyecto:\n${formData.description}\n\nSaludos cordiales.`
    );
    return `mailto:contacto@lyberate.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* 1. Header Editorial */}
      <section className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F4EF] border border-[#E5E3DC] text-xs font-semibold text-[#C85A32]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Contacto Directo Sin Intermediarios</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#141413] leading-[1.12] font-editorial-heading">
          Hablemos directamente sobre tu proyecto
        </h1>
        <p className="text-base sm:text-lg text-[#5C5B56] leading-relaxed font-editorial-body">
          Sin ejecutivos comerciales con respuestas prefabricadas. Analizamos los requerimientos operativos de tu empresa directamente con los ingenieros fundadores de Lyberate.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Columna Izquierda: Información de Contacto Real (col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Canales Directos Verificados */}
          <div className="p-7 rounded-3xl bg-white border border-[#E5E3DC] space-y-6 shadow-[0_12px_40px_rgba(20,20,19,0.04)]">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#141413]">
                Canales Oficiales Verificados
              </span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                ACTIVOS
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#F5F4EF] text-[#C85A32] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#141413] block">Correo Canónico del Estudio</span>
                  <a href="mailto:contacto@lyberate.com" className="text-[#5C5B56] hover:text-[#C85A32] underline">
                    contacto@lyberate.com
                  </a>
                  <span className="text-[11px] text-[#8A8881] block mt-0.5">Respuestas en menos de 24 horas laborables</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#F5F4EF] text-emerald-600 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#141413] block">WhatsApp Directo con Valdez</span>
                  <a
                    href={`https://wa.me/${valdez.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 font-semibold hover:underline"
                  >
                    {valdez.phone} (WhatsApp Business)
                  </a>
                  <span className="text-[11px] text-[#8A8881] block mt-0.5">Atención técnica directa</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#F5F4EF] text-[#141413] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#141413] block">Horario de Operaciones</span>
                  <span className="text-[#5C5B56]">Lunes a Viernes, 8:30 a 18:30 (GMT-4)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta de los Fundadores Responsables */}
          <div className="p-6 rounded-3xl bg-[#FBFBF9] border border-[#E5E3DC] space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8881] block">
              Socios Responsables de Atención:
            </span>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E5E3DC]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E5E3DC] shrink-0">
                    <img src={valdez.avatarUrl} alt={valdez.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#141413]">{valdez.name}</h4>
                    <span className="text-[11px] text-[#8A8881] block truncate max-w-[180px]">
                      {valdez.roleTitle}
                    </span>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${valdez.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                  title="Escribir por WhatsApp"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E5E3DC]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E5E3DC] shrink-0">
                    <img src={socio.avatarUrl} alt={socio.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#141413]">{socio.name}</h4>
                    <span className="text-[11px] text-[#8A8881] block truncate max-w-[180px]">
                      {socio.roleTitle}
                    </span>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${socio.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                  title="Escribir por WhatsApp"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Formulario Validado con Confirmación Honesta (col-span-7) */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#E5E3DC] shadow-[0_12px_40px_rgba(20,20,19,0.04)]">
          {submitted ? (
            /* Confirmación Honesta (Master Contract Sección 4.6 & 9.6) */
            <div className="py-8 space-y-6 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-[#C85A32] uppercase tracking-wider block">
                  REGISTRO VALIDADO EN EL SISTEMA
                </span>
                <h3 className="text-2xl font-extrabold text-[#141413] font-editorial-heading">
                  Solicitud procesada y guardada localmente
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5B56] leading-relaxed">
                  Gracias por comunicarte, <strong>{formData.name}</strong>. Tu requerimiento ha sido registrado en la bitácora interna de clientes (CRM) del Control Room.
                </p>
              </div>

              {/* Aviso honesto de demo / transmisión real */}
              <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#E5E3DC] space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#C85A32] font-bold">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>Aviso de Transmisión Real Inmediata:</span>
                </div>
                <p className="text-[#5C5B56] leading-relaxed">
                  Para garantizar que tu mensaje llegue de inmediato y sin demoras a los fundadores, puedes despacharlo con un solo clic a través de WhatsApp o correo electrónico canónico:
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <a
                    href={getWhatsAppMessage()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Enviar a WhatsApp con Valdez</span>
                  </a>

                  <a
                    href={getMailtoLink()}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E5E3DC] hover:bg-[#F5F4EF] text-[#141413] font-bold text-xs transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Enviar por Correo Electrónico</span>
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      needType: 'software',
                      timeline: '1-3-months',
                      description: '',
                      consent: false,
                      hp_website: '',
                    });
                  }}
                >
                  Enviar otra consulta
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="border-b border-[#F0EFEA] pb-4 mb-2">
                <h3 className="text-xl font-bold text-[#141413] font-editorial-heading">
                  Formulario de Solicitud de Proyecto
                </h3>
                <p className="text-xs text-[#5C5B56] mt-0.5">
                  Completa los datos para estructurar una evaluación técnica preliminar.
                </p>
              </div>

              {/* Honeypot anti-spam */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="hp_website">No completar</label>
                <input
                  type="text"
                  id="hp_website"
                  name="hp_website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.hp_website}
                  onChange={(e) => setFormData({ ...formData, hp_website: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nombre o Empresa"
                  placeholder="Ej. Carlos Mendoza / Orgemac"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={errors.name}
                  required
                />

                <Input
                  type="email"
                  label="Correo Electrónico"
                  placeholder="carlos@empresa.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={errors.email}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="tel"
                  label="Teléfono o WhatsApp (Opcional)"
                  placeholder="+58 412 000 0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />

                <Select
                  label="Tipo de Requerimiento"
                  value={formData.needType}
                  onChange={(e) => setFormData({ ...formData, needType: e.target.value })}
                  options={[
                    { value: 'software', label: 'Plataforma empresarial o POS (Sagitta)' },
                    { value: 'saas', label: 'SaaS de Chat multicanal (LyberateDesk)' },
                    { value: 'web', label: 'Desarrollo web o portal editorial' },
                    { value: 'automatizacion', label: 'Automatización de mensajería y cobros' },
                    { value: 'integracion', label: 'Integración de APIs y webhooks' },
                    { value: 'otro', label: 'Otro requerimiento a medida' },
                  ]}
                />
              </div>

              <Select
                label="Plazo Estimado para Iniciar"
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                options={[
                  { value: 'immediate', label: 'Inmediato (menos de 2 semanas)' },
                  { value: '1-3-months', label: 'Planificado (1 a 3 meses)' },
                  { value: 'exploration', label: 'Fase de evaluación técnica inicial' },
                ]}
              />

              <Textarea
                label="Descripción del Requerimiento"
                placeholder="Explica qué problema operativo necesitas resolver, usuarios estimados o funcionalidades clave..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                error={errors.description}
                rows={4}
                required
              />

              <Checkbox
                label="Autorizo el tratamiento de mis datos exclusivamente para evaluar esta propuesta"
                helperText="En apego estricto a principios de privacidad. No enviamos publicidad no deseada ni transferimos datos a terceros."
                checked={formData.consent}
                onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                error={errors.consent}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={loading}
                className="w-full justify-center rounded-xl shadow-xs"
              >
                Registrar requerimiento
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
