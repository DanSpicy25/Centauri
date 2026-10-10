import React, { useState } from 'react';
import {
  MessageSquare,
  Mail,
  X,
  ExternalLink,
  ChevronRight,
  Shield,
  Briefcase,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { profileRepository } from '../../repositories/profileRepository';

export const FloatingContactWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const activeProfile = profileRepository.getActiveProfile();

  const whatsappMessage = encodeURIComponent(
    `Hola ${activeProfile.name}, me gustaría cotizar un desarrollo de software a medida con Lyberate.`
  );
  const whatsappUrl = `https://wa.me/${activeProfile.phone.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;
  const mailtoUrl = `mailto:${activeProfile.email}?subject=Consulta%20de%20Proyecto%20Software%20-%20Lyberate`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Popover flotante (iOS27 Liquid Glass Style) */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white/95 backdrop-blur-2xl rounded-2xl p-4 shadow-2xl border border-[#E5E3DC] animate-fadeIn text-xs text-[#141413]">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#C85A32] text-white flex items-center justify-center font-bold text-xs">
                L
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#141413]">Hablemos de tu Proyecto</h4>
                <p className="text-[10px] text-[#8A8881]">Atendido por {activeProfile.name}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-[#8A8881] hover:text-[#141413] hover:bg-[#F5F4EF] cursor-pointer"
              aria-label="Cerrar ventana de contacto"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 space-y-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="font-bold block">Chatear por WhatsApp</span>
                  <span className="text-[10px] text-emerald-700">Respuesta promedio &lt; 15 min</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <a
              href={mailtoUrl}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#FBFBF9] hover:bg-[#F5F4EF] text-[#141413] border border-[#E5E3DC] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C85A32]" />
                <div>
                  <span className="font-bold block">Enviar Correo Directo</span>
                  <span className="text-[10px] text-[#8A8881]">{activeProfile.email}</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#8A8881]" />
            </a>

            <Link
              to="/trabajos"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#FBFBF9] hover:bg-[#F5F4EF] text-[#141413] border border-[#E5E3DC] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4 text-[#5C5B56]" />
                <div>
                  <span className="font-bold block">Ver Portafolio de Casos</span>
                  <span className="text-[10px] text-[#8A8881]">Casos de estudio reales</span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#8A8881] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="mt-3 pt-2 border-t border-[#F0EFEA] flex items-center justify-between text-[10px] text-[#8A8881]">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-600" />
              Ingeniería a Medida
            </span>
            <Link to="/admin" className="hover:text-[#C85A32] underline" onClick={() => setIsOpen(false)}>
              Control Room
            </Link>
          </div>
        </div>
      )}

      {/* Botón pastilla principal */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 bg-[#141413] hover:bg-[#2A2926] text-white px-4 py-3 rounded-full shadow-xl border border-[#3E3D38] transition-all transform hover:scale-105 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
        aria-label="Abrir asistente de contacto rápido"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-bold tracking-wide">¿Hablamos?</span>
        <MessageSquare className="w-4 h-4 text-[#C85A32]" />
      </button>
    </div>
  );
};

