# Roadmap de fases — Centauri / Lyberate

Las fases son secuenciales. No saltar a una fase posterior por conveniencia sin registrar el motivo y aprobarlo.

| Fase | Nombre | Resultado verificable |
|---|---|---|
| 00 | Auditoría y definición | Inventario de sitios/repos, capacidades, licencias, riesgos, decisiones pendientes y arquitectura recomendada |
| 01 | Fundaciones y sistema visual | Proyecto limpio, tokens, tipografía, componentes base, layouts públicos/privados y controles de calidad |
| 02 | Web pública de Lyberate | Landing page premium, navegación, Sobre nosotros, Servicios, Productos, Contacto y footer |
| 03 | Portafolio y casos de estudio | Carrusel de Inicio, catálogo filtrable, detalle de proyecto, atribución y estados de contenido |
| 04 | CMS editorial | Edición segura de páginas/secciones, vista previa, borradores, publicación y versiones |
| 05 | Centro de sitios | Inventario de sitios, monitorización e integraciones reales de analítica, con fuentes visibles |
| 06 | Clientes, oportunidades y proyectos | CRM básico, pipeline, tareas y relación con sitios/productos/proyectos |
| 07 | Productos, planes y finanzas | Catálogo comercial, suscripciones e informes financieros conectados a fuentes verificadas |
| 08 | Integraciones y automatización | Conectores, estado, logs, reintentos, secretos y automatizaciones autorizadas |
| 09 | Seguridad, calidad y lanzamiento | Auditoría, accesibilidad, rendimiento, respaldo/restauración, despliegue y documentación operativa |

## Dependencias

- Fase 00 no modifica código de repositorios existentes.
- Fase 01 establece el lenguaje visual y la base de código.
- Fase 02 no necesita esperar al CRM completo; puede usar contenido local tipado mientras se define la API.
- Fase 03 amplía la vitrina integrada en Inicio y crea páginas detalladas.
- Fase 04 necesita contratos claros de contenido y permisos.
- Fases 05–08 dependen de APIs, permisos, credenciales de prueba y fuentes de datos reales.
- Fase 09 debe repetirse parcialmente después de cambios grandes, no dejarse solo para el final.

## Regla de cierre de fase

Cada fase entrega: implementación/documentación correspondiente, pruebas ejecutadas, lista de archivos modificados, decisiones tomadas, riesgos abiertos, deuda técnica y recomendación de siguiente fase. Usar `PHASE_REPORT_TEMPLATE.md`.
