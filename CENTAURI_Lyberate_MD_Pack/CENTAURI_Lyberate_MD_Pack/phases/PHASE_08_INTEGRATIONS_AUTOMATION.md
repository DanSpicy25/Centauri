# FASE 08 — Integraciones y automatizaciones

## Objetivo
Conectar sistemas aprobados de forma observable, revocable y segura.

## Requisitos
- Catálogo de integraciones y estado de conexión.
- Flujo de conexión y desconexión.
- Secretos almacenados únicamente en backend/gestor seguro.
- Permisos mínimos por integración.
- Logs sin secretos, ejecución con ID, resultado, duración y errores sanitizados.
- Reintentos con backoff para operaciones seguras; idempotencia para acciones críticas.
- Webhooks autenticados cuando se usen.
- Automatizaciones explícitas con disparador, condiciones, acciones, propietario, historial, pausa y desactivación.
- Confirmación humana antes de acciones externas de alto impacto.
- Límites y protecciones contra bucles.

## Aceptación
Integraciones probadas en sandbox, errores recuperables, desconexión funcional, secretos ocultos, auditoría disponible y documentación de operación.
