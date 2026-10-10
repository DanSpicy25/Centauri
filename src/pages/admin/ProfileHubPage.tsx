import React, { useState } from 'react';
import {
  User,
  Save,
  CheckCircle2,
  Code2,
  Smartphone,
  Mail,
  Phone,
  Globe,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { profileRepository, FounderProfileDTO } from '../../repositories/profileRepository';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';

export const ProfileHubPage: React.FC = () => {
  const [profiles, setProfiles] = useState<FounderProfileDTO[]>(() =>
    profileRepository.getProfiles()
  );
  const [activeProfileId, setActiveProfileId] = useState<string>(() =>
    profileRepository.getActiveProfile().id
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  const activeProfile =
    profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const [formData, setFormData] = useState<FounderProfileDTO>({ ...activeProfile });
  const [newSpecialty, setNewSpecialty] = useState('');

  const handleSelectProfile = (id: string) => {
    setActiveProfileId(id);
    profileRepository.setActiveProfileId(id);
    const target = profiles.find((p) => p.id === id);
    if (target) {
      setFormData({ ...target });
    }
  };

  const handleSave = () => {
    try {
      const updated = profileRepository.updateProfile(formData.id, formData);
      setProfiles(profileRepository.getProfiles());
      setFormData({ ...updated });
      setFeedback('Perfil actualizado exitosamente. Cambios guardados en almacenamiento seguro.');
      setTimeout(() => setFeedback(null), 4000);
    } catch {
      setFeedback('Error al guardar el perfil.');
    }
  };

  const handleAddSpecialty = () => {
    if (!newSpecialty.trim()) return;
    if (formData.specialties.includes(newSpecialty.trim())) return;
    setFormData({
      ...formData,
      specialties: [...formData.specialties, newSpecialty.trim()],
    });
    setNewSpecialty('');
  };

  const handleRemoveSpecialty = (item: string) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.filter((s) => s !== item),
    });
  };

  const handleReset = () => {
    profileRepository.resetToDefault();
    setProfiles(profileRepository.getProfiles());
    const resetActive = profileRepository.getActiveProfile();
    setActiveProfileId(resetActive.id);
    setFormData({ ...resetActive });
    setFeedback('Perfiles restaurados a sus valores verificados de auditoría.');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E5E3DC]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#F5F4EF] border border-[#E5E3DC] text-[11px] font-bold text-[#C85A32] mb-2">
            <User className="w-3 h-3" />
            <span>Control Room — Perfil & Identidad Full-Stack</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#141413] tracking-tight font-editorial-heading">
            Personalización de Perfiles & Socios
          </h1>
          <p className="text-sm text-[#5C5B56] mt-1 font-editorial-body">
            Configuración de credenciales, especialidades full-stack, firmas automatizadas y presencia ejecutiva de los socios fundadores.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5 text-xs">
            <RotateCcw className="w-3.5 h-3.5 text-[#8A8881]" />
            <span>Restaurar Predeterminados</span>
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} className="gap-1.5 text-xs">
            <Save className="w-3.5 h-3.5" />
            <span>Guardar Perfil</span>
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Switcher de Socio Fundador (Estilo iOS Píldora) */}
      <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-[#E5E3DC] w-fit shadow-xs">
        <span className="text-xs font-bold text-[#8A8881] px-3 uppercase tracking-wider">
          Socio Activo:
        </span>
        {profiles.map((p) => {
          const isSelected = p.id === activeProfileId;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelectProfile(p.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-[#141413] text-white shadow-xs'
                  : 'bg-[#F5F4EF] text-[#5C5B56] hover:text-[#141413]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#C85A32]" />
              <span>{p.name}</span>
            </button>
          );
        })}
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Tarjeta de Presentación iOS27 Glass (col-span-4) */}
        <div className="lg:col-span-4 bg-white/95 backdrop-blur-xl rounded-3xl border border-[#E5E3DC] p-6 shadow-sm space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative w-28 h-28 rounded-3xl overflow-hidden border-2 border-[#C85A32] shadow-md mb-4 bg-[#F5F4EF]">
              <img
                src={formData.avatarUrl}
                alt={formData.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs text-[10px] text-white py-0.5 font-mono">
                Full-Stack
              </div>
            </div>

            <h3 className="text-xl font-bold text-[#141413]">{formData.name}</h3>
            <p className="text-xs font-semibold text-[#C85A32] mt-0.5">{formData.roleTitle}</p>
            <p className="text-xs text-[#5C5B56] mt-3 leading-relaxed text-balance">
              {formData.bio}
            </p>
          </div>

          <div className="pt-4 border-t border-[#F0EFEA] space-y-2.5 text-xs">
            <div className="flex items-center gap-2.5 text-[#5C5B56]">
              <Mail className="w-4 h-4 text-[#C85A32] shrink-0" />
              <span className="truncate">{formData.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[#5C5B56]">
              <Phone className="w-4 h-4 text-[#C85A32] shrink-0" />
              <span>{formData.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[#5C5B56]">
              <Globe className="w-4 h-4 text-[#C85A32] shrink-0" />
              <span>Tema: {formData.themePreference.toUpperCase()}</span>
            </div>
          </div>

          {/* Botones de acción rápida para full stacks */}
          <div className="pt-4 border-t border-[#F0EFEA] space-y-2">
            <span className="text-[10px] font-bold text-[#8A8881] uppercase tracking-wider block">
              Acciones de Ingeniería & Dirección
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-[11px] justify-center gap-1"
                onClick={() => {
                  navigator.clipboard.writeText(formData.emailSignature);
                  setFeedback('Firma de correo copiada al portapapeles.');
                  setTimeout(() => setFeedback(null), 3000);
                }}
              >
                <Zap className="w-3 h-3 text-[#C85A32]" />
                <span>Copiar Firma</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-[11px] justify-center gap-1"
                onClick={() => {
                  window.open(`https://wa.me/${formData.whatsappNumber.replace(/[^0-9]/g, '')}`, '_blank');
                }}
              >
                <Smartphone className="w-3 h-3 text-emerald-600" />
                <span>Abrir WhatsApp</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Formulario de Edición (col-span-8) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E5E3DC] p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#141413]">Datos del Perfil & Credenciales</h3>
            <p className="text-xs text-[#5C5B56] mt-0.5">
              Personaliza el nombre, cargo oficial, imagen y canales de contacto directo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nombre Completo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Cargo / Título Oficial"
              value={formData.roleTitle}
              onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Correo Electrónico Corporativo"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Teléfono / WhatsApp Directo"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value, whatsappNumber: e.target.value })}
            />
          </div>

          <Input
            label="URL de Foto de Perfil (Avatar)"
            value={formData.avatarUrl}
            onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
            placeholder="https://..."
          />

          <Textarea
            label="Biografía & Resumen Profesional"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={3}
          />

          {/* Especialidades Full-Stack */}
          <div className="p-5 rounded-2xl bg-[#FBFBF9] border border-[#E5E3DC] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#141413] block">
                  Especialidades & Habilidades Técnicas ({formData.specialties.length})
                </span>
                <p className="text-[11px] text-[#5C5B56]">
                  Añade áreas de experiencia: Backend, Fintech, Flutter, NestJS, UI/UX, etc.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {formData.specialties.map((spec) => (
                <span
                  key={spec}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#E5E3DC] text-[#141413] shadow-xs"
                >
                  <Code2 className="w-3 h-3 text-[#C85A32]" />
                  <span>{spec}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecialty(spec)}
                    className="ml-1 text-[#8A8881] hover:text-red-600 transition-colors cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <Input
                placeholder="Nueva especialidad (ej. NestJS, Finanzas, Zelle, Docker)..."
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialty())}
                className="text-xs"
              />
              <Button type="button" size="sm" variant="outline" onClick={handleAddSpecialty}>
                Añadir
              </Button>
            </div>
          </div>

          {/* Preferencias de Tema & Firma */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Preferencia Visual del Panel"
              value={formData.themePreference}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  themePreference: e.target.value as FounderProfileDTO['themePreference'],
                })
              }
              options={[
                { value: 'ios27', label: 'iOS 27 Liquid Glass (Recomendado)' },
                { value: 'studio', label: 'Studio Editorial Minimal' },
                { value: 'dark', label: 'Dark Titanium Mode' },
              ]}
            />

            <Input
              label="URL Perfil GitHub / Repositorio"
              value={formData.githubUrl || ''}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            />
          </div>

          <Textarea
            label="Firma de Correo Electrónico Automatizada"
            value={formData.emailSignature}
            onChange={(e) => setFormData({ ...formData, emailSignature: e.target.value })}
            rows={2}
          />
        </div>
      </div>
    </div>
  );
};
