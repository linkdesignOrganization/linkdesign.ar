# Handoff al equipo del sitio — Endpoint del CRM listo para recibir leads

> **Fecha:** 2026-05-11
> **Versión del schema:** `1.0.0`
> **Backend:** `linkdesign-crm-api.azurewebsites.net` (Azure App Service, Costa Rica region)

---

## 1. URL y método

```
POST  https://linkdesign-crm-api.azurewebsites.net/api/v1/leads
GET   https://linkdesign-crm-api.azurewebsites.net/api/v1/leads/health
```

Setear en `environment.crmEndpoint` del sitio: `https://linkdesign-crm-api.azurewebsites.net/api/v1/leads`.

> **Si más adelante mapeamos `crm.linkdesign.cr`** al App Service, también funcionará en ese subdominio; el endpoint queda igual.

## 2. Autenticación

Header en cada POST:

```
X-API-Key: 93cb9e26e3576d3a63eac6418469dcb8b06734d40ca620373fd117033c22bcd8
```

(Alternativa equivalente: `Authorization: Bearer 93cb9e26…`).

**Importante:** este token va dentro del bundle del sitio, así que es visible para quien inspeccione. La defensa real está en:
- Origin/Referer allowlist server-side (sólo aceptamos `https://linkdesign.cr`, `https://www.linkdesign.cr`, `https://linkdesign.com.ar`, `https://www.linkdesign.com.ar`).
- Rate limit estricto (5 envíos / IP / hora).

Si querés más blindaje, una Azure Function intermedia que reenvíe con la key oculta es el siguiente paso lógico — el endpoint del CRM no cambiaría.

**Rotación de la key:** avisame y la roto en App Service con `az webapp config appsettings set`. Es transparente para el CRM, el sitio tiene que actualizar su secret.

## 3. CORS

El CRM ya responde a preflight con:

```
Access-Control-Allow-Origin:  <Origin del request si está en allowlist>
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-API-Key, Idempotency-Key, Authorization, Accept
Access-Control-Max-Age:       86400
```

Dominios actuales en allowlist (editables desde el panel admin del CRM, sin redeploy):
- `linkdesign.cr` / `www.linkdesign.cr`
- `linkdesign.com.ar` / `www.linkdesign.com.ar`

Cuando se lance Colombia, Chile, Venezuela, etc., los agregamos desde `/settings` y empiezan a aceptarse al instante (cache TTL 60s).

## 4. Headers recomendados

```
Content-Type:     application/json; charset=utf-8
X-API-Key:        <key arriba>
Idempotency-Key:  <mismo lead_id del payload>
Accept:           application/json
```

`Idempotency-Key` es opcional — el CRM ya hace dedup por `lead_id` del payload —, pero ayuda si quieren auditar a futuro.

## 5. Payload — recordatorio del shape

Sin cambios respecto a `docs/CRM-INTEGRATION.md` (schema `1.0.0`). Ejemplo mínimo válido:

```json
{
  "lead_id": "<UUID v4 generado en el cliente>",
  "submitted_at": "<ISO 8601>",
  "schema_version": "1.0.0",
  "contact": {
    "name": "Juan Pérez",
    "company": "Acme SA",
    "email": "juan@acme.cr",
    "email_domain_type": "corporate",
    "phone": "+50688881111",
    "phone_country_prefix": "+506"
  },
  "intent": {
    "need": ["software_a_medida"],
    "preferred_contact": ["whatsapp"],
    "message": "Necesitamos un sistema interno..."
  },
  "source": {
    "landing": "software",
    "form_location": "footer",
    "page_url": "https://linkdesign.cr/software",
    "referrer": null,
    "language": "es"
  },
  "attribution": { "utm_source": null, "utm_medium": null, "utm_campaign": null, "utm_term": null, "utm_content": null, "gclid": null, "ga_client_id": null, "first_touch_utm": null },
  "session": {
    "user_agent": "Mozilla/5.0...",
    "device_type": "desktop",
    "time_on_site_ms": 180000,
    "pages_visited": 4,
    "pages_visited_paths": ["/software", "/contact"],
    "interaction_count": 10,
    "form_load_to_submit_ms": 45000,
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
    "rate_limit_remaining": 3
  }
}
```

## 6. Respuestas que van a recibir

| Código | Cuándo | Body |
|---|---|---|
| **201** | Lead nuevo recibido. Quedó persistido y dispara email a `hola@linkdesign.cr` + admins. | `{ "lead_id": "...", "status": "received", "received_at": "<ISO>" }` |
| **200** | `lead_id` repetido (idempotency — usuario hizo doble click). NO se duplica, NO se redispara email. | `{ "lead_id": "...", "status": "already_received", "received_at": "<ISO original>" }` |
| **400** | Validación falló. | `{ "error": "validation_failed", "fields": { "contact.email": "invalid_format", ... } }` |
| **401** | API key inválida u Origin no permitido. | `{ "error": "unauthorized" }` |
| **429** | Rate limit (5/IP/hora). Header `Retry-After: 3600`. | `{ "error": "rate_limited", "retry_after_seconds": 3600 }` |
| **500** | Error interno del CRM. Reintentar más tarde. | `{ "error": "internal_error" }` |

## 7. Comportamiento especial

- **Anti-spam:** si alguno de los `passed_*` viene en `false`, el CRM acepta el POST (`201`) pero internamente marca `isSpam: true` y NO dispara email/notificación. Eso significa que el sitio puede seguir rechazando spam silenciosamente como hace hoy, y al CRM le llega información para análisis sin ruido.
- **Detección de país:** el CRM la deriva del header `Origin`. `linkdesign.cr` → CR, `linkdesign.com.ar` → AR. Si el header no es claro, cae al `session.country` que envíen.
- **Email subject:** el correo interno se prefija con el país detectado, por ejemplo `[CRM-CR] Nuevo Web Lead — Acme SA`.

## 8. Curl de prueba (para QA)

```bash
curl -X POST https://linkdesign-crm-api.azurewebsites.net/api/v1/leads \
  -H 'Content-Type: application/json' \
  -H 'X-API-Key: 93cb9e26e3576d3a63eac6418469dcb8b06734d40ca620373fd117033c22bcd8' \
  -H 'Origin: https://linkdesign.cr' \
  -d '{
    "lead_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "submitted_at": "2026-05-11T12:00:00.000Z",
    "schema_version": "1.0.0",
    "contact": { "name": "Test QA", "company": "QA Co", "email": "qa@test.cr", "email_domain_type": "corporate", "phone": "+50688881111", "phone_country_prefix": "+506" },
    "intent": { "need": ["software_a_medida"], "preferred_contact": ["whatsapp"], "message": "QA test" },
    "source": { "landing": "software", "form_location": "footer", "page_url": "https://linkdesign.cr/software", "referrer": null, "language": "es" },
    "attribution": { "utm_source": null, "utm_medium": null, "utm_campaign": null, "utm_term": null, "utm_content": null, "gclid": null, "ga_client_id": null, "first_touch_utm": null },
    "session": { "user_agent": "curl", "device_type": "desktop", "time_on_site_ms": 60000, "pages_visited": 2, "pages_visited_paths": ["/software"], "interaction_count": 5, "form_load_to_submit_ms": 20000, "screen_resolution": null, "timezone": "America/Costa_Rica", "locale": "es-CR", "country": "CR", "country_source": "both" },
    "anti_spam": { "passed_honeypot": true, "passed_time_check": true, "passed_interaction_check": true, "rate_limit_remaining": 5 }
  }'
```

Primer envío → `201`. Repetir con mismo `lead_id` → `200`.

## 9. Healthcheck (para monitoreo del sitio)

```
GET https://linkdesign-crm-api.azurewebsites.net/api/v1/leads/health
```

Retorna estado de configuración y count de leads recibidos en últimas 24h. Lo pueden usar antes de habilitar `environment.crmEndpoint` para confirmar que está respondiendo.

## 10. Activación

Cuando estén listos:

1. Setear `environment.crmEndpoint = 'https://linkdesign-crm-api.azurewebsites.net/api/v1/leads'`.
2. Guardar la API key en su secret manager (Azure Function app settings, GitHub Secrets, etc.).
3. Deployar.
4. Hacer un envío de prueba real desde el form de `/contact` para verificar end-to-end (el lead aparecerá en `https://victorious-stone-0cb3a940f.2.azurestaticapps.net/web-leads` y nosotros recibimos el correo).

Cualquier duda, `hola@linkdesign.cr`.
