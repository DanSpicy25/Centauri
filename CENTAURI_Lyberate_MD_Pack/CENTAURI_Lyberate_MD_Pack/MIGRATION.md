# Integración y migración desde sistemas existentes

El proyecto nuevo se construye desde cero. Este documento no autoriza reescribir, borrar ni migrar automáticamente datos de los repositorios existentes.

## Inventario

Registrar por cada sitio/producto:
- nombre y URL;
- repositorio y acceso confirmado;
- responsable/propietario;
- stack verificada;
- entorno y estado conocido;
- API disponible y documentación;
- datos que podría exponer;
- licencias de código y dependencias;
- permisos para mostrar capturas/marca;
- estrategia de integración candidata;
- riesgos y preguntas pendientes.

## Opciones de integración

1. Enlace externo simple.
2. Importación manual de metadatos públicos.
3. API de solo lectura.
4. API bidireccional con permisos explícitos.
5. Conector con sincronización periódica.
6. Migración de datos aprobada y probada.

Elegir la opción más simple que cubra el caso. No fusionar bases de datos ni compartir autenticación por conveniencia.

## Migración de datos

Antes de cualquier migración:
- acordar propietario y alcance;
- obtener copia de seguridad;
- mapear campos y estados;
- detectar duplicados;
- definir tratamiento de datos personales;
- ejecutar ensayo con muestra;
- comparar recuentos y muestras;
- documentar rollback;
- obtener aprobación humana para el corte.

## Licencias

Verificar licencias de cada repositorio y dependencias. No asumir que un cambio de marca elimina obligaciones de licencia. Consultar asesoría legal para dudas de distribución/comercialización.
