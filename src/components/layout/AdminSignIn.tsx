import React, { FormEvent, useState } from 'react';
import {
  ArrowRight,
  Fingerprint,
  LockKeyhole,
  ShieldCheck,
  AlertTriangle,
  Smartphone,
  KeyRound,
  RotateCcw,
  CheckCircle2,
  UserCheck,
} from 'lucide-react';
import { mockBackendRepository } from '../../repositories/mockBackendRepository';
import type { MockAdminSession } from '../../repositories/mockBackendRepository';

interface AdminSignInProps {
  onSignedIn: (session: MockAdminSession) => void;
}

export const AdminSignIn: React.FC<AdminSignInProps> = ({ onSignedIn }) => {
  const accounts = mockBackendRepository.getDemoAccounts();
  const [profileId, setProfileId] = useState<MockAdminSession['profileId']>('valdez');
  const [pin, setPin] = useState('');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de simulación de escenarios de seguridad
  const [simulateUntrusted, setSimulateUntrusted] = useState(false);
  const [simulate2fa, setSimulate2fa] = useState(false);
  const [authStep, setAuthStep] = useState<'credentials' | 'otp'>('credentials');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);

  const realTrusted = mockBackendRepository.isCurrentDeviceTrusted(profileId);
  const isTrusted = simulateUntrusted ? false : realTrusted;

  const handleQuickFill = (targetId: MockAdminSession['profileId'], targetPin: string) => {
    setProfileId(targetId);
    setPin(targetPin);
    setError(null);
  };

  const handleCredentialsSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    // Si la simulación de 2FA está activada, validar primero PIN y avanzar a desafío OTP
    if (simulate2fa) {
      const isValid = mockBackendRepository.verifyCredentials(profileId, pin);
      if (!isValid) {
        setError('El PIN no coincide con la cuenta seleccionada.');
        return;
      }
      const code = mockBackendRepository.generateDemoOtp(profileId);
      setGeneratedOtp(code);
      setAuthStep('otp');
      setOtpCode('');
      return;
    }

    // Flujo normal directo
    try {
      const session = mockBackendRepository.signIn(profileId, pin, rememberDevice && !simulateUntrusted);
      onSignedIn(session);
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : 'No se pudo iniciar sesión.');
    }
  };

  const handleOtpSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (otpCode !== generatedOtp) {
      setError('El código de verificación temporal es inválido o no coincide con la simulación.');
      return;
    }

    try {
      const session = mockBackendRepository.signIn(profileId, pin, rememberDevice && !simulateUntrusted);
      onSignedIn(session);
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : 'Error al completar la autenticación.');
    }
  };

  const handleResetDefaults = () => {
    mockBackendRepository.resetToDefault();
    setPin('');
    setError(null);
    setAuthStep('credentials');
    setResetFeedback('Valores de fábrica restablecidos: Valdez 246810 · Socio 135790');
    setTimeout(() => setResetFeedback(null), 3500);
  };

  return (
    <main className="admin-signin-page">
      <section className="admin-signin-card" aria-labelledby="admin-signin-title">
        <div className="admin-signin-mark" aria-hidden="true">L</div>
        <div className="admin-signin-eyebrow"><ShieldCheck size={15} /> CONTROL ROOM · DEMOSTRACIÓN</div>
        <h1 id="admin-signin-title">Acceso de socios</h1>
        <p className="admin-signin-intro">
          Elige tu cuenta para continuar. Este acceso local simula la conexión al backend que integrará tu socio.
        </p>

        {resetFeedback && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{resetFeedback}</span>
          </div>
        )}

        {/* Botones de Relleno Rápido de Demostración */}
        <div className="mt-4 pt-3 border-t border-[#E5E3DC]">
          <span className="text-[11px] font-bold text-[#8A8881] uppercase tracking-wider block mb-2">
            Acceso Rápido para Demostración:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('valdez', '246810')}
              className={`p-2 rounded-xl text-left border transition-all text-xs flex items-center justify-between cursor-pointer ${
                profileId === 'valdez'
                  ? 'bg-[#F5F3FF] border-[#7C3AED] text-[#7C3AED] font-semibold ring-1 ring-[#7C3AED]/30'
                  : 'bg-white border-[#E5E3DC] text-[#5C5B56] hover:bg-[#F5F4EF]'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <UserCheck className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Valdez</span>
              </div>
              <span className="font-mono text-[10px] text-[#8A8881]">246810</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('socio', '135790')}
              className={`p-2 rounded-xl text-left border transition-all text-xs flex items-center justify-between cursor-pointer ${
                profileId === 'socio'
                  ? 'bg-[#F5F3FF] border-[#7C3AED] text-[#7C3AED] font-semibold ring-1 ring-[#7C3AED]/30'
                  : 'bg-white border-[#E5E3DC] text-[#5C5B56] hover:bg-[#F5F4EF]'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <UserCheck className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Socio</span>
              </div>
              <span className="font-mono text-[10px] text-[#8A8881]">135790</span>
            </button>
          </div>
        </div>

        {/* Banner de Alerta de Dispositivo No Reconocido (Cuando está activo) */}
        {!isTrusted && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-1.5 animate-fadeIn">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Alerta de Seguridad (Simulada)</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800">
              Acceso detectado desde entorno no reconocido (IP simulada: 190.75.12.44, Caracas). Se requiere confirmación de credenciales para autorizar el dispositivo.
            </p>
          </div>
        )}

        {/* PASO 1: Formulario de Credenciales Principales (PIN) */}
        {authStep === 'credentials' && (
          <form className="admin-signin-form" onSubmit={handleCredentialsSubmit}>
            <label className="admin-signin-label" htmlFor="admin-account">Cuenta</label>
            <select
              id="admin-account"
              value={profileId}
              onChange={(event) => {
                setProfileId(event.target.value as MockAdminSession['profileId']);
                setPin('');
                setError(null);
              }}
            >
              {accounts.map((item) => (
                <option key={item.profileId} value={item.profileId}>{item.email}</option>
              ))}
            </select>

            <div className="admin-device-status" role="status">
              <Fingerprint size={17} className={isTrusted ? 'text-[#7C3AED]' : 'text-amber-600'} />
              <span>{isTrusted ? 'Este navegador ya está reconocido' : 'Este navegador aún no está reconocido; ingresa tu PIN'}</span>
            </div>

            <label className="admin-signin-label" htmlFor="admin-pin">PIN de 6 dígitos</label>
            <div className="admin-pin-field">
              <LockKeyhole size={17} aria-hidden="true" />
              <input
                id="admin-pin"
                type="password"
                inputMode="numeric"
                autoComplete="current-password"
                pattern="[0-9]{6}"
                maxLength={6}
                value={pin}
                onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="••••••"
                aria-describedby={error ? 'admin-signin-error' : 'admin-pin-help'}
                required
              />
            </div>
            <p id="admin-pin-help" className="admin-signin-help">
              PIN inicial de demostración: Valdez 246810 · Socio 135790. Se puede cambiar desde Seguridad.
            </p>

            {/* Opciones de Simulación Avanzada */}
            <div className="space-y-2 pt-2 border-t border-[#F0EFEA]">
              <label className="admin-trust-option">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(event) => setRememberDevice(event.target.checked)}
                />
                <span>Recordar este navegador como dispositivo de confianza</span>
              </label>

              <label className="admin-trust-option">
                <input
                  type="checkbox"
                  checked={simulate2fa}
                  onChange={(event) => setSimulate2fa(event.target.checked)}
                />
                <span className="flex items-center gap-1.5 font-medium text-[#141413]">
                  <Smartphone className="w-3.5 h-3.5 text-[#7C3AED]" />
                  Simular desafío 2FA / OTP (Fase 2 de autenticación)
                </span>
              </label>

              <label className="admin-trust-option">
                <input
                  type="checkbox"
                  checked={simulateUntrusted}
                  onChange={(event) => setSimulateUntrusted(event.target.checked)}
                />
                <span>Simular navegador nuevo / no reconocido</span>
              </label>
            </div>

            {error && <p id="admin-signin-error" className="admin-signin-error" role="alert">{error}</p>}

            <button className="admin-signin-submit cursor-pointer" type="submit">
              {simulate2fa ? (
                <>
                  Continuar a Desafío 2FA <ArrowRight size={16} />
                </>
              ) : (
                <>
                  Entrar al panel <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {/* PASO 2: Desafío 2FA OTP Simulada */}
        {authStep === 'otp' && (
          <form className="admin-signin-form animate-fadeIn" onSubmit={handleOtpSubmit}>
            <div className="p-3.5 rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] text-[#141413] text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-[#7C3AED]">
                <div className="flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4" />
                  <span>Desafío 2FA / OTP Activo</span>
                </div>
                <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-[#DDD6FE]">
                  SMS / Authenticator
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#5C5B56]">
                Demostración: Se ha enviado un código temporal de 6 dígitos al teléfono móvil registrado de {profileId === 'valdez' ? 'Valdez (+58 412 ***-**12)' : 'Socio (+58 414 ***-**88)'}.
              </p>
              <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-[#DDD6FE]">
                <span className="text-[11px] text-[#5C5B56]">Código simulado:</span>
                <span className="font-mono font-bold text-sm text-[#7C3AED] tracking-widest">{generatedOtp}</span>
                <button
                  type="button"
                  onClick={() => generatedOtp && setOtpCode(generatedOtp)}
                  className="text-[10px] font-bold text-[#7C3AED] hover:underline cursor-pointer"
                >
                  Autocompletar
                </button>
              </div>
            </div>

            <label className="admin-signin-label" htmlFor="admin-otp">Código OTP de 6 dígitos</label>
            <div className="admin-pin-field">
              <KeyRound size={17} aria-hidden="true" />
              <input
                id="admin-otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={otpCode}
                onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="482910"
                aria-describedby={error ? 'admin-signin-error' : undefined}
                required
                autoFocus
              />
            </div>

            {error && <p id="admin-signin-error" className="admin-signin-error" role="alert">{error}</p>}

            <button className="admin-signin-submit cursor-pointer" type="submit">
              Verificar y Entrar al Panel <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthStep('credentials');
                setError(null);
              }}
              className="mt-2 text-center text-xs text-[#5C5B56] hover:text-[#141413] transition-colors cursor-pointer py-1"
            >
              ← Volver al paso anterior (PIN)
            </button>
          </form>
        )}

        {/* Footer y Opciones de Reseteo */}
        <div className="admin-signin-disclaimer flex items-center justify-between gap-3 text-left">
          <span>Simulación local con persistencia en navegador.</span>
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-[10px] text-[#8A8881] hover:text-[#7C3AED] flex items-center gap-1 shrink-0 cursor-pointer"
            title="Restablecer PINs originales de fábrica"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restablecer fábrica</span>
          </button>
        </div>
      </section>
    </main>
  );
};
