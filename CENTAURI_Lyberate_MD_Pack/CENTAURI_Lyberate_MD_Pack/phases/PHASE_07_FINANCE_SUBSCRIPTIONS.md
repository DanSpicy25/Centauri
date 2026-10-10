# FASE 07 — Productos, planes, suscripciones y finanzas

## Condición de entrada
No iniciar hasta definir modelo comercial, proveedor de pagos/facturación, impuestos aplicables y acceso a un entorno de pruebas.

## Objetivo
Administrar productos/planes y visualizar finanzas con fuentes verificables.

## Requisitos
- Catálogo de productos y versiones.
- Planes con precio, moneda, periodo, límites y soporte aprobados.
- Suscripciones con estado proveniente de la fuente autorizada.
- Facturas/recibos y enlaces al sistema fuente.
- Ingresos por periodo con definición de métrica explícita.
- Exportaciones autorizadas y auditoría.
- Manejo de moneda, zona horaria, reembolsos, fallos de cobro y cancelaciones según proveedor.
- Estados de sincronización y conciliación.

## No hacer
- No procesar tarjetas directamente si el proveedor puede manejarlo.
- No inventar ingresos ni calcular MRR sin definir inclusiones/exclusiones.
- No guardar datos de tarjetas.
- No emitir facturas fiscales sin validar requisitos legales y proveedor.

## Aceptación
Datos de sandbox verificados, fuentes claramente indicadas, conciliación básica documentada, permisos y casos de error probados.
