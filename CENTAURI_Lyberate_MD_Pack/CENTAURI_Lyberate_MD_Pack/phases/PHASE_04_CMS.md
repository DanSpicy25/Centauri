# FASE 04 — CMS y personalización controlada de la web

## Objetivo
Permitir que usuarios autorizados actualicen contenido sin tocar código, manteniendo la identidad visual.

## Capacidades
- Gestionar páginas y secciones mediante bloques/variantes aprobados.
- Editar textos, imágenes, enlaces, orden y visibilidad.
- Gestionar proyectos, categorías, servicios y productos publicables.
- Vista previa responsive.
- Borrador, revisión, publicación y despublicación.
- Versiones, historial y restauración.
- SEO básico: title, description, canonical y social image.
- Gestión segura de medios con alt text y créditos.
- Validación de campos requeridos y enlaces.
- Confirmación de publicación y acciones destructivas.
- Auditoría de quién cambió/publicó qué.

## Diseño de producto
El editor debe ofrecer previsualización y controles claros, no un clon libre de Webflow. Usar un esquema de secciones que permita flexibilidad dentro de límites de diseño.

## Seguridad
Permisos comprobados en servidor; sanitización de contenido; no ejecutar HTML/scripts arbitrarios; validación de uploads; protección de borradores no publicados.

## Aceptación
Edición, previsualización, publicación y rollback probados; roles aplicados; contenido no publicado no se filtra al sitio público.
