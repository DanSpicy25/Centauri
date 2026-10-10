# FASE 00 — Auditoría de activos, alcance y arquitectura

## Objetivo

Auditar sitios y repositorios existentes para comprender qué hay disponible y tomar decisiones informadas para construir **una plataforma nueva desde cero**. La auditoría es de solo lectura.

## Leer

- `CENTAURI_MASTER.md`
- `PHASES.md`
- `INTEGRATION_INVENTORY.md`
- `ARCHITECTURE.md`
- `SECURITY.md`
- `PHASE_REPORT_TEMPLATE.md`

## Reglas

- No modificar, formatear, borrar, migrar ni reescribir repositorios existentes.
- No crear commits ni publicar despliegues.
- No asumir que puedes acceder a todos los repositorios.
- No afirmar que un sitio fue inspeccionado si no se abrió realmente.
- Si no hay una carpeta de trabajo nueva designada, entregar recomendaciones y documentos en la carpeta de documentación del proyecto nuevo solo si la ubicación es inequívoca; si no, pedir confirmación en vez de tocar un repo heredado.
- No instalar dependencias ni ejecutar scripts potencialmente destructivos.
- No incluir secretos en el informe.
- Diferenciar claramente hechos verificados, inferencias y preguntas abiertas.
- La finalidad no es copiar la arquitectura vieja: es aprender de ella y diseñar una solución nueva.

## Tareas

1. Comprobar contexto del entorno y acceso disponible.
2. Revisar el estado Git de cada repositorio accesible (`status`, rama, últimos commits) sin modificarlo.
3. Inspeccionar README, licencias, estructura de carpetas, package manifests, configuración y documentación relevante.
4. Identificar stack real de frontend/backend, sistema de datos, API, auth, despliegue, pruebas y calidad; indicar “no confirmado” cuando falte evidencia.
5. Para los sitios web, observar las páginas públicas accesibles: navegación, contenido, responsive aparente, marca, SEO básico y posibles activos de portafolio. No inferir métricas privadas.
6. Confirmar la licencia del código principal y dependencias importantes en los repositorios accesibles. Señalar riesgos para distribución comercial y recomendar revisión legal cuando proceda.
7. Crear inventario de los proyectos conocidos y una lista de datos que el usuario debe proporcionar para completar los ~40 sitios.
8. Recomendar arquitectura nueva y opciones de stack con ventajas, costes, mantenimiento, riesgos y curva de aprendizaje. No aprobar una decisión sin dejarla registrada como propuesta.
9. Definir límites entre frontend público, frontend administrativo, backend y adaptadores de integración.
10. Definir la primera entrega viable: web pública excelente + vitrina de proyectos + páginas principales. El panel se diseña como sistema separado y se implementa progresivamente.
11. Enumerar preguntas que bloquean contenido real: logo, fotos, bios, atribución de proyectos, servicios/productos oficiales, contacto, URLs y permisos.
12. Entregar un informe conciso y verificable.

## Repositorios/sitios iniciales

- `https://github.com/Lyberate-app/CrmChatLyberateSis`
- `https://github.com/DanSpicy25/Sagita`
- `https://github.com/Lyberate-app/contactoconlanoticia.com`
- `https://github.com/Lyberate-app/MotoIndy`
- `https://orgemac.com/`
- `https://pinkfashionve.com/`
- `https://wilanye.com/` (confirmar URL y relación)
- La web/repositorio actual de Lyberate, si existe y el usuario proporciona la URL correcta.
- Otros sitios que el usuario añadirá al inventario.

## Entregables

- `PROJECT_AUDIT.md`: resumen de hallazgos y evidencia.
- `INTEGRATION_INVENTORY.md`: inventario completado hasta donde haya evidencia.
- `ARCHITECTURE.md`: propuesta revisada, con límites claros.
- `DECISIONS.md`: ADRs propuestos y aprobados claramente diferenciados.
- `SECURITY.md`: riesgos concretos observados.
- `PHASE_REPORT.md`: resultado de la fase.

No generar una aplicación todavía. No pasar a Fase 01 automáticamente sin que el usuario revise las decisiones importantes.
