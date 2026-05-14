/**
 * Lead form options — chips de selección única.
 * Centraliza los valores que se mandan al CRM para no tener strings sueltos.
 */

export type NeedOption =
  | 'software_a_medida'
  | 'sitio_web'
  | 'ecommerce'
  | 'otro';

export type PreferredContactOption =
  | 'correo'
  | 'whatsapp'
  | 'llamada';

export type SourceLanding =
  | 'corporate'
  | 'weblab'
  | 'software'
  | 'contact';

export type FormLocation = 'footer' | 'contact_page';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export type EmailDomainType = 'personal' | 'corporate';

export type Language = 'es' | 'en';

/**
 * Opciones de chips para "¿Qué necesitás?"
 */
export const NEED_OPTIONS: Array<{
  value: NeedOption;
  labelKey: string;
}> = [
  { value: 'software_a_medida', labelKey: 'LEAD_FORM.NEED_OPTIONS.SOFTWARE_A_MEDIDA' },
  { value: 'sitio_web',         labelKey: 'LEAD_FORM.NEED_OPTIONS.SITIO_WEB' },
  { value: 'ecommerce',         labelKey: 'LEAD_FORM.NEED_OPTIONS.ECOMMERCE' },
  { value: 'otro',              labelKey: 'LEAD_FORM.NEED_OPTIONS.OTRO' }
];

/**
 * Opciones de chips para "¿Cómo preferís que te contactemos?"
 */
export const CONTACT_OPTIONS: Array<{
  value: PreferredContactOption;
  labelKey: string;
  icon: string;
}> = [
  { value: 'correo',   labelKey: 'LEAD_FORM.CONTACT_OPTIONS.CORREO',   icon: 'bi-envelope' },
  { value: 'whatsapp', labelKey: 'LEAD_FORM.CONTACT_OPTIONS.WHATSAPP', icon: 'bi-whatsapp' },
  { value: 'llamada',  labelKey: 'LEAD_FORM.CONTACT_OPTIONS.LLAMADA',  icon: 'bi-telephone' }
];

/**
 * Dominios de email considerados "personales" (consumer).
 * Todo lo demás se clasifica como "corporate".
 */
export const PERSONAL_EMAIL_DOMAINS = [
  'gmail.com',
  'hotmail.com',
  'hotmail.es',
  'outlook.com',
  'outlook.es',
  'yahoo.com',
  'yahoo.es',
  'icloud.com',
  'live.com',
  'live.cl',
  'aol.com',
  'protonmail.com',
  'proton.me',
  'me.com'
];

/**
 * Dominios de email "throwaway" / desechables — se rechazan.
 */
export const DISPOSABLE_EMAIL_DOMAINS = [
  'mailinator.com',
  'tempmail.com',
  'guerrillamail.com',
  'sharklasers.com',
  '10minutemail.com',
  'trashmail.com',
  'yopmail.com',
  'fakeinbox.com',
  'maildrop.cc',
  'dispostable.com'
];

/**
 * Configuración de rate limiting client-side.
 * NOTA: esto es solo UX/anti-spam casual. El rate limit real vive en el CRM.
 */
export const RATE_LIMIT_CONFIG = {
  MIN_INTERVAL_MS: 60_000,        // 1 envío cada 60 segundos
  MAX_PER_HOUR: 3,                // máximo 3 envíos por hora
  HISTORY_WINDOW_MS: 60 * 60 * 1000, // ventana de historia: 1 hora
};

/**
 * Configuración anti-spam.
 */
export const ANTI_SPAM_CONFIG = {
  MIN_TIME_TO_SUBMIT_MS: 5000,    // 5 segundos mínimos entre carga y envío
  MIN_INTERACTIONS: 1,             // al menos 1 interacción (focus/input/keydown)
};

/**
 * TTL del UTM persistido en localStorage.
 */
export const UTM_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 días

/**
 * Storage keys con prefijo namespaced para evitar colisiones.
 */
export const STORAGE_KEYS = {
  UTM: 'ld_utm',
  FIRST_TOUCH_UTM: 'ld_first_touch_utm',
  SUBMIT_HISTORY: 'ld_submit_history',
  LAST_SUBMIT: 'ld_last_submit',
  FIRST_LOAD: 'ld_first_load_at',
};

/**
 * Schema version del payload — bumpear cuando haya breaking changes.
 */
export const PAYLOAD_SCHEMA_VERSION = '1.0.0' as const;

/**
 * Configuración del evento de conversión de Google Ads que se dispara
 * cuando se envía el form de leads exitosamente.
 *
 * ── PRIORIDAD vs OTROS EVENTOS DEL SITIO ──────────────────────────────────
 * El submit del form representa el lead-data MÁS VALIOSO del sitio:
 * el usuario llenó manualmente sus datos completos (nombre, correo, teléfono,
 * necesidad, mensaje opcional). Esto es señal de intención mucho más fuerte
 * que un click externo a WhatsApp o al calendario, porque trae información
 * estructurada para sales.
 *
 * Valores actuales en el sitio (mismo `send_to` para todos):
 *   - Submit del form     → VALUE 100  ← este (lead completo, oro)
 *   - Click "Agendar"     → value 30   (intent de llamada)
 *   - Copy de email       → value 25
 *   - Click WhatsApp      → value 5
 *   - Scroll 50%          → value 1    (señal débil)
 *
 * ── TODO PARA EL EQUIPO DE ADS ────────────────────────────────────────────
 * Recomendación: crear una conversion action DEDICADA en Google Ads
 * para "Form Submit" (categoría: "Submit lead form" o "Sign-up") y
 * reemplazar SEND_TO con el nuevo ID. Hoy reutilizamos el send_to genérico
 * de engagement, lo cual mezcla forms con clicks de email/WhatsApp/calendar.
 *
 * Beneficios de una conversion action dedicada:
 *   1. Smart Bidding puede optimizar específicamente por form-submits.
 *   2. Reporting más limpio (no se diluye con clicks de bajo intent).
 *   3. Permite establecer la "primary conversion" del sitio en Ads.
 */
export const GA_CONVERSION = {
  SEND_TO: 'AW-16767245191/qSMFCN2ek-YZEIe3n7s-',
  VALUE: 100,
  CURRENCY: 'USD',
  EVENT_NAME: 'conversion' as const
};
