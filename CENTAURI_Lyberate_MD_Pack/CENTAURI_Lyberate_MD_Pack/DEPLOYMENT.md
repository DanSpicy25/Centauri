# Despliegue — plantilla inicial

La infraestructura se decide después de la Fase 00. No asumir proveedor ni publicar secretos.

## Entornos

- Local: desarrollo con datos ficticios.
- Staging: integración y pruebas con cuentas/servicios de prueba.
- Producción: datos reales, acceso restringido y monitorización.

## Requisitos por decidir

- Hosting frontend.
- Hosting/API backend.
- Base de datos y backups.
- Dominio público y subdominio/ruta privada administrativa.
- Gestión de secretos.
- CDN/almacenamiento de medios.
- Correo transaccional y antispam.
- Monitorización y alertas.
- Analítica.
- Proceso de despliegue y rollback.

## Checklist

- Variables de entorno documentadas sin valores secretos.
- Build reproducible.
- Migraciones con plan de rollback cuando sea posible.
- Backups y restauración verificados.
- HTTPS y cabeceras de seguridad.
- Logs sin secretos/datos personales innecesarios.
- Health checks y alertas configurados.
- Ruta de rollback probada.
- Confirmar que el CMS no permite publicar por accidente contenido en borrador.
- Confirmar permisos y CORS en producción.
