# Contrato API — borrador inicial

La API definitiva se define con el backend tras la auditoría. No asumir que los repositorios existentes comparten API ni autenticación.

## Reglas

- Versionar bajo `/api/v1/` salvo decisión documentada.
- Documentar autenticación, permisos, errores, paginación, filtros, ordenamiento y límites.
- Validar entradas en servidor; no confiar en validación del frontend.
- No exponer secretos ni detalles internos.
- Usar respuestas de error consistentes y códigos HTTP apropiados.
- Documentar ejemplos ficticios como ejemplos, nunca como datos de producción.

## Recursos candidatos

- `pages`, `page-sections`, `navigation`, `media`
- `projects`, `project-categories`, `case-studies`
- `services`, `products`
- `contact-inquiries`
- `managed-sites`, `site-checks`, `analytics-connections`
- `clients`, `opportunities`, `tasks`
- `subscriptions`, `invoices` (solo cuando se defina la integración financiera)
- `users`, `roles`, `permissions`, `audit-events`
- `integrations`, `sync-runs`, `automation-runs`

No implementarlos todos de una vez. Cada fase define únicamente los recursos que necesita.

## Patrón frontend

Usar un cliente API centralizado con:
- base URL por entorno;
- tipado de respuestas;
- manejo consistente de errores;
- cancelación de peticiones cuando proceda;
- estado de carga/error/vacío;
- reintentos solo para operaciones seguras;
- separación entre datos de demo y datos reales.

Los mocks deben vivir en un lugar explícito y mostrar una señal de demo en entornos no productivos. Nunca incluir credenciales reales en mocks.

## Seguridad

Cada endpoint privado debe definir permisos necesarios y comprobarlos en servidor. Documentar cómo se invalidan sesiones, cómo se manejan CSRF cuando aplique y cómo se limita el abuso.
