# FASE 05 — Inventario y centro de sitios

## Objetivo
Registrar y supervisar los sitios que Lyberate posee, gestiona o mantiene, sin inventar datos ni asumir acceso administrativo.

## Requisitos
- Inventario con URL, relación, responsable, estado, entorno, notas y última comprobación.
- Monitor de disponibilidad y latencia con frecuencia y límites configurables.
- Historial de comprobaciones y estados degradados.
- Integración analítica autorizada cuando se elija proveedor.
- Fuente, rango temporal y última sincronización junto a cada métrica.
- Estado de integración: sin conectar, conectado, error o datos desactualizados.
- Alertas configurables, límites para evitar ruido y registro de eventos.
- Separar “el sitio responde” de “el negocio está funcionando”.
- Importador de URL seguro que genera borrador y no publica automáticamente.

## No hacer
- No mostrar visitas/ventas/ingresos estimados como reales.
- No intentar acceder a paneles privados sin autorización.
- No escanear ni atacar dominios; comprobaciones simples y autorizadas solamente.
- No almacenar contraseñas de hosting en texto plano.

## Aceptación
Inventario útil, monitor real o estado “no conectado”, historial visible, errores comprensibles, controles de permisos y documentación de la fuente de cada dato.
