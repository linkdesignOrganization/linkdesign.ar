# Integración del Form de Leads con el CRM

> **Audiencia:** equipo de desarrollo del CRM de Link Design.
> **Objetivo:** todo lo que necesitan para construir el endpoint que reciba los leads desde el sitio web y la feature interna que los muestre.
> **Versión del schema:** `1.0.0` (campo `schema_version` en el payload).

---

## 1. Resumen ejecutivo

El sitio web de Link Design (`linkdesign.cr`, stack Angular 14 + SSR) tiene un formulario de captura de leads en el footer que aparece en 4 rutas:

- `/corporate` — landing del servicio corporativo
- `/weblab` — landing del servicio creativo (también accesible por `/creative`)
- `/software` — landing del servicio de software a medida
- `/contact` — página de contacto

**No aparece** en `/` (home), `/politicas-de-privacidad` ni en rutas 404.

Cuando un usuario envía el form, el sitio arma un **payload JSON enriquecido** que incluye no solo los datos que el usuario tipeó sino también una capa amplia de contexto auto-capturado (origen de la visita, recorrido por el sitio, atribución de marketing, telemetría, anti-spam, etc.).

El CRM debe:

1. **Recibir** ese payload vía un endpoint HTTPS público
2. **Validar y sanitizar** los datos server-side (defensa en profundidad)
3. **Persistir** el lead en su base de datos
4. **Notificar** al equipo comercial correspondiente
5. **Exponer una UI** donde el equipo pueda ver y trabajar el lead

Hasta que ese endpoint exista, el sitio simula el envío con `console.log` del payload completo en el browser (variable de entorno `crmEndpoint` vacía → no se llama HTTP). Una vez que el endpoint esté listo, se setea `environment.crmEndpoint` y nada más cambia del lado del front.

---

## 2. Contrato del endpoint

### 2.1. URL y método

```
POST https://<dominio-del-crm>/api/v1/leads
```

Convención sugerida: `crm.linkdesign.cr` o el dominio interno que ya estén usando. **HTTPS obligatorio.**

### 2.2. Headers que el sitio enviará

| Header | Valor | Notas |
|---|---|---|
| `Content-Type` | `application/json; charset=utf-8` | Siempre |
| `X-API-Key` | `<token-secreto>` | Si eligen API key auth |
| `Authorization` | `Bearer <token>` | Alternativa a X-API-Key |
| `Idempotency-Key` | `<lead_id del payload>` | Para evitar duplicados por doble-click |
| `Accept` | `application/json` | Siempre |

### 2.3. Autenticación

El sitio Angular corre en el browser, por lo que cualquier token enviado **es visible para cualquier usuario** que inspeccione el bundle. Para mitigar esto recomendamos **una de estas dos opciones**:

**Opción A (recomendada): Proxy intermedio en Azure Function**

Como el sitio ya está desplegado en Azure Static Web Apps (ver `staticwebapp.config.json`), se aprovecha su API integrada:

1. Crear una Function `/api/submit-lead` que reciba el payload del browser.
2. La Function guarda el `CRM_API_KEY` como secret en Azure.
3. La Function reenvía el payload al CRM con el token correcto.

Beneficio: el token nunca sale del servidor.

**Opción B: Token público + restricción de origen**

1. CRM acepta el `X-API-Key` enviado directo desde el browser.
2. CRM **rechaza** cualquier request cuyo header `Origin` no sea `https://linkdesign.cr` o `https://www.linkdesign.cr`.
3. Implementar rate-limiting **estricto** por IP (ej: 5 envíos / IP / hora).

Beneficio: simplicidad. Riesgo: el token se puede extraer y un atacante puede falsificar el header `Origin` desde un script no-browser.

### 2.4. CORS

El CRM debe responder a las preflight requests con:

```
Access-Control-Allow-Origin: https://linkdesign.cr
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-API-Key, Idempotency-Key, Authorization
Access-Control-Max-Age: 86400
```

Si usan staging (`staging.linkdesign.cr`) o dominio `www`, agregarlos.

### 2.5. Idempotencia

El sitio genera un `lead_id` (UUID v4) **client-side** antes de enviar. Si el usuario hace doble-click en el botón de enviar, el sitio mandará 2 requests con el **mismo `lead_id`**.

El CRM debe:
- Usar `lead_id` (o el header `Idempotency-Key`) como clave de deduplicación.
- En la segunda request: devolver el mismo `lead_id` con status 200 (en vez de crear duplicado).

### 2.6. Rate limiting server-side

El cliente tiene rate-limiting (max 1 envío / 60s / sesión, max 3 / hora) pero **eso es solo UX**. El CRM debe tener su propio rate-limit. Recomendado:

- **5 envíos / IP / hora** → bloqueo temporal.
- **20 envíos / IP / día** → bloqueo permanente para esa IP.
- **3 envíos con el mismo email en 24h** → no rechazar, pero marcar como sospechoso.

---

## 3. Schema del payload

### 3.1. Estructura general

```
{
  lead_id, submitted_at, schema_version,
  contact:     { ... datos del usuario ... },
  intent:      { ... qué quiere ... },
  source:      { ... de dónde vino ... },
  attribution: { ... UTM, gclid, ga_client_id ... },
  session:     { ... telemetría, device, país ... },
  anti_spam:   { ... flags de validación ... }
}
```

### 3.2. Schema completo (TypeScript)

La fuente de verdad del schema está en `src/app/lead-form/models/lead-payload.model.ts` del repositorio del sitio. Reproducido aquí con propósitos de referencia:

```typescript
interface LeadPayload {
  lead_id: string;          // UUID v4 generado client-side
  submitted_at: string;     // ISO 8601, ej "2026-05-10T18:23:45.123Z"
  schema_version: string;   // "1.0.0" actualmente

  contact: {
    name: string;                       // requerido, 2-80 chars, sanitizado
    company: string | null;             // opcional, max 120 chars
    email: string;                      // requerido, formato email, lowercase
    email_domain_type: 'personal' | 'corporate';
    phone: string;                      // E.164: "+50688881111"
    phone_country_prefix: string;       // "+506", "+1", etc.
  };

  intent: {
    need: Array<'software_a_medida' | 'sitio_web' | 'ecommerce' | 'otro'>;
    preferred_contact: Array<'correo' | 'whatsapp' | 'llamada'>;
    message: string | null;             // opcional, max 1000 chars
  };

  source: {
    landing: 'corporate' | 'weblab' | 'software' | 'contact';
    form_location: 'footer' | 'contact_page';  // solo 'footer' por ahora
    page_url: string;
    referrer: string | null;
    language: 'es' | 'en';
  };

  attribution: {
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_term: string | null;
    utm_content: string | null;
    gclid: string | null;
    ga_client_id: string | null;        // parseado de cookie _ga
    first_touch_utm: object | null;     // UTM del primer touchpoint
  };

  session: {
    user_agent: string;
    device_type: 'mobile' | 'tablet' | 'desktop';
    time_on_site_ms: number;            // ms desde la primera carga
    pages_visited: number;              // contador total
    pages_visited_paths: string[];      // recorrido cronológico
    interaction_count: number;          // eventos de focus/input en form
    form_load_to_submit_ms: number;     // tiempo de llenado
    screen_resolution: string | null;   // "1920x1080"
    timezone: string | null;            // "America/Costa_Rica"
    locale: string | null;              // "es-CR"
    country: string | null;             // "CR" (ISO 3166-1 alpha-2)
    country_source: 'timezone' | 'locale' | 'both' | null;
  };

  anti_spam: {
    passed_honeypot: boolean;
    passed_time_check: boolean;
    passed_interaction_check: boolean;
    rate_limit_remaining: number;
  };
}
```

### 3.3. Ejemplo de payload real

Lead realista que llega desde Costa Rica, vino por una campaña de Google Ads de "software", visitó varias landings antes de convertir:

```json
{
  "lead_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "submitted_at": "2026-05-10T18:23:45.123Z",
  "schema_version": "1.0.0",

  "contact": {
    "name": "Juan Pérez",
    "company": "Comercializadora Andes S.A.",
    "email": "juan.perez@andes.cr",
    "email_domain_type": "corporate",
    "phone": "+50688881111",
    "phone_country_prefix": "+506"
  },

  "intent": {
    "need": ["software_a_medida", "sitio_web"],
    "preferred_contact": ["whatsapp", "correo"],
    "message": "Necesitamos un sistema interno de inventarios con un sitio público para que los clientes consulten stock. Presupuesto aproximado 12k USD, queremos arrancar en julio."
  },

  "source": {
    "landing": "software",
    "form_location": "footer",
    "page_url": "https://linkdesign.cr/software",
    "referrer": "https://www.google.com/",
    "language": "es"
  },

  "attribution": {
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "software-cr-2026-q2",
    "utm_term": "desarrollo software empresa",
    "utm_content": "ad-variant-b",
    "gclid": "Cj0KCQjwsoe0BhDdARIsAMxrkw3...",
    "ga_client_id": "1234567890.1234567890",
    "first_touch_utm": {
      "utm_source": "google",
      "utm_medium": "cpc",
      "utm_campaign": "software-cr-2026-q2"
    }
  },

  "session": {
    "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
    "device_type": "desktop",
    "time_on_site_ms": 386500,
    "pages_visited": 6,
    "pages_visited_paths": [
      "/software",
      "/corporate",
      "/weblab",
      "/software",
      "/contact",
      "/software"
    ],
    "interaction_count": 14,
    "form_load_to_submit_ms": 67300,
    "screen_resolution": "1920x1080",
    "timezone": "America/Costa_Rica",
    "locale": "es-CR",
    "country": "CR",
    "country_source": "both"
  },

  "anti_spam": {
    "passed_honeypot": true,
    "passed_time_check": true,
    "passed_interaction_check": true,
    "rate_limit_remaining": 2
  }
}
```

---

## 4. Referencia de campos (qué significa cada uno)

### 4.1. Identificación

| Campo | Tipo | Notas |
|---|---|---|
| `lead_id` | UUID v4 string | Generado client-side. Usar como clave de dedupe. |
| `submitted_at` | ISO 8601 string | Timestamp del momento del submit en el browser del usuario (timezone del browser, ver `session.timezone`). |
| `schema_version` | string | `"1.0.0"`. Versionar si cambia el schema. |

### 4.2. `contact` — datos del usuario

| Campo | Tipo | Validación cliente | Recomendación CRM |
|---|---|---|---|
| `name` | string | requerido, 2-80 chars, sin links | Re-validar longitud y patrón. Mostrar destacado en la UI. |
| `company` | string \| null | opcional, max 120 chars, sin links | Si está presente, el lead es probablemente B2B. Si null, B2C/freelancer. |
| `email` | string | requerido, formato email válido, no dominios desechables | Re-validar formato. Verificar MX del dominio (opcional). |
| `email_domain_type` | `"personal"` \| `"corporate"` | auto-clasificado | "corporate" indica más probabilidad de B2B. Útil para scoring. |
| `phone` | string | requerido, E.164 (+...) | Normalizar y mostrar formato local en UI según país. |
| `phone_country_prefix` | string | derivado del phone | Permite filtrar leads por país sin depender solo de geo-detección. |

### 4.3. `intent` — qué quiere el lead

| Campo | Tipo | Notas |
|---|---|---|
| `need` | array de strings | **Multi-select OPCIONAL**. Puede venir vacío `[]`. Si vacío, significa "no marcó preferencia" (probablemente quiere asesoramiento). Valores posibles: `software_a_medida`, `sitio_web`, `ecommerce`, `otro`. |
| `preferred_contact` | array de strings | **Multi-select REQUERIDO**. Mínimo 1, máximo 3. Valores: `correo`, `whatsapp`, `llamada`. Si trae varios, el lead acepta cualquiera. |
| `message` | string \| null | Opcional, max 1000 chars. Texto libre sanitizado. |

**⚠️ Importante:** `need` y `preferred_contact` son **arrays** (no strings). Diseñar las columnas de DB en consecuencia (tabla relacional o columna JSON/JSONB).

**Mapping para mostrar en la UI:**
- `need`: `software_a_medida` → "Software a medida" · `sitio_web` → "Sitio web" · `ecommerce` → "E-commerce" · `otro` → "Otro"
- `preferred_contact`: `correo` → "Correo" · `whatsapp` → "WhatsApp" · `llamada` → "Llamada"

### 4.4. `source` — de dónde vino el lead

| Campo | Tipo | Notas |
|---|---|---|
| `landing` | string | Landing **donde estaba el usuario al enviar el form**. Crítico para entender qué oferta convirtió. Ver mapping abajo. |
| `form_location` | string | Por ahora siempre `"footer"`. Cuando se implemente la versión expandida en `/contact`, también puede ser `"contact_page"`. |
| `page_url` | string | URL completa de la página al momento del submit. |
| `referrer` | string \| null | De dónde llegó al sitio (Google, LinkedIn, directo, etc.). |
| `language` | `"es"` \| `"en"` | Idioma del sitio al momento del submit. Asignar al ejecutivo bilingüe correspondiente. |

**Mapping de `landing` para tu equipo de ventas:**

| Valor en payload | Significado | Tipo de cliente típico |
|---|---|---|
| `corporate` | Sitio Corporativo | Empresas que buscan presencia corporativa profesional |
| `weblab` | WebLab / Creativo | Proyectos creativos, branding, sitios experimentales |
| `software` | Software a Medida | Empresas que necesitan desarrollo a medida (SaaS, sistemas internos) |
| `contact` | Página de Contacto | El usuario entró directo a contactar — no se identificó con una oferta específica |

### 4.5. `attribution` — marketing attribution

| Campo | Tipo | Notas |
|---|---|---|
| `utm_source` | string \| null | Origen de la campaña (ej: `google`, `facebook`, `linkedin`, `newsletter`). |
| `utm_medium` | string \| null | Tipo de canal (`cpc`, `organic`, `email`, `social`). |
| `utm_campaign` | string \| null | Nombre de la campaña. |
| `utm_term` | string \| null | Keyword de Google Ads. |
| `utm_content` | string \| null | Variante creativa. |
| `gclid` | string \| null | Google Click ID. Permite hacer **offline conversion upload** a Google Ads cuando el lead se convierte en cliente. |
| `ga_client_id` | string \| null | Client ID de GA4 (parseado de cookie `_ga`). Útil para enviar eventos offline a GA4 cuando el lead progresa. |
| `first_touch_utm` | objeto \| null | UTM de la **primera** vez que el usuario llegó al sitio (puede diferir del último). Útil para atribución first-touch vs last-touch. |

**🎯 Recomendación importante:** persistir el `gclid` y `ga_client_id` en el CRM permite hacer **offline conversion tracking**. Cuando un lead se convierte en cliente cerrado, mandar el evento de conversión a Google Ads con ese gclid → cierra el loop de atribución y mejora el ML del ad bidding.

### 4.6. `session` — telemetría y contexto del usuario

| Campo | Tipo | Notas |
|---|---|---|
| `user_agent` | string | Útil para debugging y detección avanzada de bots. |
| `device_type` | `"mobile"` \| `"tablet"` \| `"desktop"` | Categorización rápida del dispositivo. |
| `time_on_site_ms` | number | Milisegundos en el sitio desde la primera carga de esta sesión. **Indicador fuerte de intención**: leads con >2 minutos exploraron más. |
| `pages_visited` | number | Contador de páginas visitadas. |
| `pages_visited_paths` | array de strings | **Recorrido cronológico** de rutas visitadas. Ej: `["/corporate", "/weblab", "/software", "/contact"]`. Muestra el journey completo. Limitado a 30 últimos. |
| `interaction_count` | number | Eventos de interacción en el form. Bajo este número → potencialmente bot o autofill. |
| `form_load_to_submit_ms` | number | Tiempo desde que el form se renderizó hasta el submit. |
| `screen_resolution` | string \| null | Útil para análisis de UX. |
| `timezone` | string \| null | Timezone IANA. Útil para saber cuándo contactar. |
| `locale` | string \| null | Locale del navegador (`es-CR`, `en-US`). |
| `country` | string \| null | **País detectado** (ISO 3166-1 alpha-2: `CR`, `MX`, `US`, etc.). Inferido sin servicios externos. |
| `country_source` | string | `"timezone"`, `"locale"`, `"both"` o `null`. **`"both"` = alta confianza**, `"timezone"` = media, `"locale"` = baja. |

### 4.7. `anti_spam` — flags de validación

| Campo | Tipo | Notas |
|---|---|---|
| `passed_honeypot` | boolean | Si false → casi seguro bot. El sitio ya rechaza estos silenciosamente, así que normalmente verán `true`. |
| `passed_time_check` | boolean | Si false → submit en menos de 5s (probable bot). |
| `passed_interaction_check` | boolean | Si false → ninguna interacción real con el form. |
| `rate_limit_remaining` | number | Cuántos envíos le quedan al cliente en su ventana de rate limit local. |

**⚠️ Estos flags son client-side. El CRM debe tener sus propios checks server-side (rate limit por IP, validación de patrones, etc.).**

---

## 5. Códigos de respuesta esperados

El sitio espera estos códigos. Adaptar al stack del CRM si se necesita.

### 5.1. Éxito

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "lead_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "status": "received",
  "received_at": "2026-05-10T18:23:46.001Z"
}
```

### 5.2. Validación fallida

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "validation_failed",
  "fields": {
    "email": "invalid_format",
    "phone": "invalid_format"
  }
}
```

### 5.3. Autenticación fallida

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{ "error": "unauthorized" }
```

### 5.4. Rate limit

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 3600

{
  "error": "rate_limited",
  "retry_after_seconds": 3600
}
```

### 5.5. Idempotency (duplicate)

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "lead_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "status": "already_received",
  "received_at": "2026-05-10T18:23:46.001Z"
}
```

### 5.6. Error interno

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{ "error": "internal_error" }
```

---

## 6. Lead scoring sugerido

Recomendamos calcular un score automático en el CRM al recibir cada lead para que ventas pueda priorizar. Esta es una fórmula propuesta:

### 6.1. Factores que suman

| Factor | Puntos |
|---|---|
| `contact.email_domain_type === "corporate"` | +15 |
| `contact.company !== null` | +10 |
| `intent.need` contiene `software_a_medida` | +20 |
| `intent.need` contiene `ecommerce` | +12 |
| `intent.need` contiene `sitio_web` | +8 |
| `intent.need.length >= 2` (multi-servicio) | +5 |
| `intent.preferred_contact` contiene `llamada` | +12 |
| `intent.preferred_contact` contiene `whatsapp` | +8 |
| `intent.message !== null` y > 100 chars | +12 |
| `intent.message` menciona timing o presupuesto (regex `/mes|presupuesto|usd|colones|julio|agosto|septiembre|.../i`) | +10 |
| `source.landing === "software"` | +10 |
| `source.landing === "corporate"` | +5 |
| `attribution.utm_medium === "cpc"` (campaña paga) | +8 |
| `attribution.gclid !== null` | +5 |
| `session.time_on_site_ms > 120000` (>2 min) | +10 |
| `session.pages_visited >= 3` | +8 |
| `session.pages_visited >= 5` | +5 (acumulable con el anterior) |
| `session.country === "CR"` (mercado local) | +8 |
| `session.country_source === "both"` (alta confianza) | +2 |
| `anti_spam.passed_*` todos `true` | +5 |

### 6.2. Factores que restan

| Factor | Puntos |
|---|---|
| `contact.email_domain_type === "personal"` | -5 |
| `intent.preferred_contact.length === 1 && preferred_contact[0] === "correo"` y `device_type === "mobile"` | -3 |
| `session.time_on_site_ms < 30000` (<30s) | -10 |
| `session.pages_visited === 1` | -8 |
| `session.interaction_count < 3` | -5 |
| `session.form_load_to_submit_ms < 10000` (form llenado muy rápido) | -5 |
| Alguno de los `anti_spam.passed_*` es `false` | -50 |

### 6.3. Categorías por score

| Score | Etiqueta | Acción sugerida |
|---|---|---|
| **80+** | 🔥 Lead caliente | Asignar a ejecutivo senior. Contactar en <2h. |
| **50-79** | 🟡 Lead tibio | Asignar a ejecutivo. Contactar en <24h. |
| **20-49** | 🔵 Lead frío | Email automático + seguimiento en 48h. |
| **<20** | ⚪ A nutrir | Inscribir en email sequence. No llamar. |
| **<0** | ❌ Sospechoso | Marcar manualmente para revisión. |

Estas reglas son una propuesta de arranque — ajustar según conversión real medida en los primeros meses.

---

## 7. Recomendaciones de UI del CRM (la feature que van a construir)

### 7.1. Vista de lista (tabla de leads)

Columnas prioritarias (en este orden):

1. **Status del scoring** (badge con emoji color: 🔥/🟡/🔵/⚪)
2. **Nombre + Empresa** (en dos líneas: nombre arriba grande, empresa abajo gris)
3. **Email** (con botón rápido "Copiar")
4. **WhatsApp / Teléfono** (con link directo a `https://wa.me/<phone>`)
5. **¿Qué necesita?** (chips coloridos: Software, Sitio web, etc.)
6. **País** (badge con bandera + código)
7. **Landing de origen** (badge con color por tipo)
8. **Hace cuánto** (relativo: "hace 12 min")
9. **Asignado a** (avatar + nombre)
10. **Status del lead** (Nuevo / Contactado / Cualificado / Ganado / Perdido)

Filtros laterales:

- Por landing (`corporate` / `weblab` / `software` / `contact`)
- Por necesidad (multi-check de los 4 valores)
- Por canal preferido
- Por país
- Por status del scoring
- Por status del lead
- Por rango de fechas
- Por UTM source/medium/campaign (para análisis de qué canal trae mejor calidad)

### 7.2. Vista de detalle (cuando hace click en un lead)

Layout sugerido en 3 columnas:

**Columna izquierda — Contacto rápido:**
- Foto/avatar (placeholder con iniciales)
- Nombre grande
- Empresa
- Email con botón copy + abrir cliente mail
- WhatsApp con botón "Abrir chat" → `https://wa.me/<phone>?text=Hola%20<nombre>%2C%20...`
- Teléfono con botón "Llamar"
- País + bandera + timezone (para saber a qué hora llamar)
- Idioma preferido

**Columna central — Intención y mensaje:**
- ¿Qué necesita? (chips visibles destacados)
- ¿Cómo prefiere contacto? (chips)
- Mensaje completo (formateado, preservando saltos de línea)
- Score con detalle de qué factores lo formaron (expandible)

**Columna derecha — Inteligencia y atribución:**

Tarjeta "📊 Origen":
- Landing donde convirtió (destacado)
- Cómo llegó al sitio (referrer)
- UTM completo (campaña, source, medium, term, content)
- Si tiene `gclid` o `ga_client_id`, mostrar badge "Google Ads ✓"

Tarjeta "🗺️ Recorrido en el sitio":
- Timeline visual de `pages_visited_paths` (cronológico)
- Total de páginas visitadas y tiempo en sitio
- Tiempo que pasó llenando el form

Tarjeta "💻 Dispositivo":
- Tipo (mobile/tablet/desktop)
- Resolución
- Country detection con badge de confianza
- User agent (colapsado, expandible)

Tarjeta "🛡️ Anti-spam":
- 3 flags verdes/rojos
- Si alguno es rojo, alerta para que ventas le ponga atención extra

### 7.3. Acciones rápidas

Botones prominentes:

- **📞 Abrir WhatsApp** (pre-cargado con saludo personalizado en el idioma del lead)
- **✉️ Responder por email** (template con merge tags)
- **📅 Agendar reunión** (link al Google Calendar `https://calendar.app.google/ZRkWtLvfCpUSwY1XA`)
- **✏️ Cambiar status** (dropdown)
- **👤 Reasignar** (dropdown de ejecutivos)
- **📝 Agregar nota** (timeline interno)

### 7.4. Notificaciones

Cuando entra un lead nuevo:

1. **Email** al ejecutivo asignado automáticamente (por ronda o por landing).
2. **Webhook a Slack/Discord** con summary: emoji-status, nombre, empresa, necesidad principal, link al CRM.
3. **Si score >= 80**: notificación push o llamada interna prioritaria.

Asignación sugerida:

- `landing === "software"` → ejecutivo de software
- `landing === "weblab"` → ejecutivo creativo
- `landing === "corporate"` → ejecutivo corporativo
- `landing === "contact"` → round-robin entre todos

### 7.5. Dashboards y analytics

Métricas sugeridas a exponer:

- **Leads por día/semana/mes** con drill-down por landing.
- **Conversion rate por UTM campaign** — qué campaña paga genera mejores leads.
- **Conversion rate por país** — dónde está el mejor mercado.
- **Tiempo promedio de primer contacto** (KPI del equipo de ventas).
- **Lead-to-customer rate por score range** — para validar/ajustar la fórmula del scoring.
- **Distribución de devices** — mobile vs desktop.
- **Recorrido más común** — qué pages_visited_paths convierten más.

---

## 8. Seguridad server-side requerida

Recordatorio importante: **TODO lo que llega del cliente debe re-validarse en el server**. El front hace muchas verificaciones pero un atacante puede saltarlas.

### 8.1. Re-validación

- **Email**: formato + MX lookup opcional.
- **Phone**: formato E.164 estricto + posiblemente validación con un servicio externo si quieren.
- **Longitudes**: re-validar maxLength de cada campo.
- **Tipos**: que `need` y `preferred_contact` sean arrays con valores del enum permitido.
- **Sanitización**: aplicar escape HTML antes de almacenar (defensa adicional contra XSS si después se renderea en el CRM).

### 8.2. Rate limiting por IP

Implementar a nivel de reverse proxy (nginx/CloudFlare) o middleware. Reglas mínimas:
- **5 envíos / IP / hora** → throttle
- **20 envíos / IP / día** → bloqueo

### 8.3. Detección de duplicados

Antes de insertar un lead nuevo, verificar:

1. **`lead_id` existente** → devolver 200 con `status: "already_received"` (idempotency).
2. **Email duplicado en últimas 24h** → no rechazar, pero crear como "lead repetido" y agregar como nota al lead original (probablemente el usuario insistió porque no recibió respuesta).
3. **Phone duplicado en últimas 24h** → similar al email.

### 8.4. Honeypot reverso (opcional)

Si quieren extra seguridad, el endpoint puede:
- Comparar `anti_spam.passed_*` flags → si alguno es false, marcar el lead como spam y NO notificar al equipo.
- Aceptar igual el insert pero con flag `is_spam: true` para revisión manual posterior.

---

## 9. Casos especiales y edge cases

### 9.1. Lead con `intent.need` vacío

El usuario no marcó ningún chip de necesidad (es opcional). En la UI mostrar: *"No especificó — probablemente quiere asesoramiento"* y orientar al ejecutivo a hacer discovery en la primera llamada.

### 9.2. Lead sin UTM ni gclid

Tráfico directo u orgánico. `attribution.*` vendrá lleno de `null`. Mostrar en UI: *"Acceso directo / orgánico"* y derivar el origen del `referrer` si existe.

### 9.3. Lead sin `country` detectado

Cuando `session.country === null` (timezone exótico no mapeado y locale sin región). Mostrar: *"País no detectado"* y derivar de `phone_country_prefix` o preguntar al lead.

### 9.4. Lead con flags de anti-spam en `false`

El sitio rechaza la mayoría de spam silenciosamente, pero algunos llegan con flags rojos. Estos leads probablemente son bots — recomendamos:
- Marcar automáticamente como `is_suspicious: true`.
- No notificar al equipo de ventas.
- Mantener para análisis y posiblemente entrenar un detector de spam en el futuro.

### 9.5. Lead duplicado (mismo email en <24h)

El usuario probablemente reenvió porque no obtuvo respuesta. **No** crear un lead nuevo desde cero — en su lugar:
- Agregar una nota al lead original con el nuevo mensaje y timestamp.
- Subir el score del lead original (insistencia = más intención).
- Notificar al ejecutivo asignado de que el lead volvió a escribir.

### 9.6. Lead que cambia de idioma a mitad de sesión

`session.language` es el idioma al momento del submit. Si el usuario navegó en ES y al final cambió a EN antes de submit, llega como `en`. No es problema, pero el `first_touch_utm` y otros datos persistidos pueden tener detalles inconsistentes.

### 9.7. Cookie `_ga` bloqueada (ad-blocker)

`attribution.ga_client_id` vendrá `null`. No es problema — solo significa que no se podrá hacer offline conversion upload para ese lead. La atribución por UTM/gclid sigue funcionando.

---

## 10. Roadmap futuro

### v1.0.0 (actual, en producción)

- Form en el footer compartido entre 3 landings + `/contact`.
- Solo `form_location: "footer"`.
- `language` ES/EN.
- 4 valores de `need`, 3 de `preferred_contact`.

### v1.1.0 (planeado)

- Versión expandida del form en `/contact` con más campos opcionales → traerá `form_location: "contact_page"`.
- Posibles campos adicionales: cargo del lead, tamaño de empresa, presupuesto explícito (todos opcionales).
- Si se agregan, el `schema_version` sube a `1.1.0` y se mantiene retrocompatibilidad.

### v2.0.0 (potencial)

- Integración bidireccional: el CRM puede enviar al sitio el status del lead para mostrar "Ya nos contactaste, te respondemos por X" si vuelve a entrar.
- Pre-fill del form con datos conocidos si el usuario ya está identificado vía cookie/token.

---

## 11. Contacto

Si el equipo de CRM tiene dudas sobre algún campo, comportamiento del form o necesita cambios en el schema:

- **Email**: hola@linkdesign.cr
- **Repo del sitio**: github.com/linkdesignOrganization/LinkDesign2.0
- **Archivo fuente del schema**: `src/app/lead-form/models/lead-payload.model.ts`
- **Servicio que arma el payload**: `src/app/lead-form/services/lead-form.service.ts`
- **Servicio de tracking**: `src/app/lead-form/services/lead-tracking.service.ts`

---

## Apéndice A — Quick start checklist para el implementador

- [ ] Definir URL del endpoint y comunicarla.
- [ ] Decidir método de auth (recomendado: proxy en Azure Function).
- [ ] Configurar CORS para `https://linkdesign.cr` (+ staging si aplica).
- [ ] Crear tabla `leads` en la DB con todos los campos del schema (sugerencia: usar JSONB para `intent.need`, `intent.preferred_contact`, `attribution.first_touch_utm`, `session.pages_visited_paths`).
- [ ] Implementar dedupe por `lead_id` (idempotency).
- [ ] Implementar rate limit por IP.
- [ ] Implementar validación server-side.
- [ ] Implementar lead scoring automático al insertar.
- [ ] Configurar notificaciones (email + Slack/Discord).
- [ ] Definir reglas de asignación por landing.
- [ ] Construir vista de lista de leads.
- [ ] Construir vista de detalle con las 3 columnas sugeridas.
- [ ] Implementar acciones rápidas (WhatsApp, email, calendar).
- [ ] Definir y construir dashboards básicos.
- [ ] Probar con payloads de ejemplo (ver sección 3.3).
- [ ] Avisar al equipo del sitio para que setee `environment.crmEndpoint` y empiece a enviar tráfico real.

---

**Versión del documento:** 1.0.0
**Última actualización:** 2026-05-11
