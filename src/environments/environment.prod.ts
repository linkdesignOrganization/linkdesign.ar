export const environment = {
  production: true,
  siteUrl: 'https://linkdesign.cr',
  /**
   * Endpoint del CRM para envío de leads (handoff 2026-05-11).
   * Ver docs/HANDOFF-SITIO.md para detalles del contrato.
   */
  crmEndpoint: 'https://linkdesign-crm-api.azurewebsites.net/api/v1/leads',
  /**
   * API key pública del CRM. La defensa real está server-side
   * (Origin allowlist + rate limit + anti-spam flags del payload).
   */
  crmApiKey: '93cb9e26e3576d3a63eac6418469dcb8b06734d40ca620373fd117033c22bcd8'
};
