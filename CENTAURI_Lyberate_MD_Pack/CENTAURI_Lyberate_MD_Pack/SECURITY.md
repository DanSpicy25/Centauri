# Seguridad, Privacidad y Cumplimiento Legal — Lyberate

Actualizado tras los hallazgos de la auditoría técnica de la Fase 00 (10 de octubre de 2026).

---

## 1. Principios de Seguridad

- **Mínimo privilegio:** Cada servicio, token y usuario accede únicamente a los datos necesarios para su función.
- **Defensa en profundidad:** Validación redundante en cliente y servidor, con el servidor como única fuente de autoridad.
- **Autoridad de sesión en servidor:** Ningún token o permiso almacenado en `localStorage` debe ser tomado como verdad para conceder acceso o validar privilegios. Se usarán cookies seguras con atributos `HttpOnly`, `SameSite=Lax/Strict` y `Secure`.
- **Secretos fuera del código:** Prohibido almacenar claves privadas, credenciales de base de datos o tokens API en repositorios Git o bundles de frontend.

---

## 2. Hallazgos específicos de la Fase 00 y Mitigaciones

### A. Riesgo Legal de Licencia Copyleft (GNU AGPLv3)
- **Riesgo:** El repositorio satélite `CrmChatLyberateSis` está licenciado bajo **AGPLv3**. Mezclar su código fuente o enlazarlo estáticamente con el núcleo de Lyberate forzaría la liberación bajo AGPLv3 de toda la propiedad intelectual de la plataforma.
- **Mitigación obligatoria (ADR-002):** Aislamiento estricto de red. Dicho servicio se mantendrá en su propio repositorio y entorno de ejecución, interactuando únicamente a través de peticiones HTTP/REST o WebSockets. El código base de Centauri no contendrá dependencias ni fragmentos derivados de `CrmChatLyberateSis`.

### B. Prevención de Server-Side Request Forgery (SSRF) en Ingesta de URLs
- **Riesgo:** La funcionalidad futura del CMS para inspeccionar y previsualizar sitios web de clientes a partir de una URL podría ser explotada para sondear la red interna del servidor o infraestructura en la nube (AWS/GCP/DigitalOcean).
- **Mitigaciones obligatorias:**
  1. Denegar explícitamente resoluciones DNS a rangos IPv4 privados (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), loopback (`127.0.0.0/8`), link-local (`169.254.0.0/16`) e IPv6 (`::1`, `fc00::/7`).
  2. Forzar exclusivamente protocolos `http://` y `https://`.
  3. Establecer timeouts estrictos (máx. 5 segundos) y límite de transferencia de bytes (máx. 2 MB).
  4. La ingesta de metadatos genera siempre un estado borrador (`draft`), que requiere aprobación humana explícita antes de publicarse.

### C. Confidencialidad y Atribución Pública de Portafolio
- **Riesgo:** Publicar nombres comerciales, capturas de pantalla o casos de estudio de clientes sin autorización contractual previa.
- **Mitigación:** Aplicar formalmente la lista de verificación [`CONTENT_APPROVAL_CHECKLIST.md`](file:///C:/Users/Valdez/Documents/Centauri/CENTAURI_Lyberate_MD_Pack/CENTAURI_Lyberate_MD_Pack/templates/CONTENT_APPROVAL_CHECKLIST.md) antes de activar cualquier proyecto en la vitrina pública.
