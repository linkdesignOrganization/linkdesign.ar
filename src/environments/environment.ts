// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  siteUrl: 'http://localhost:4200',
  /**
   * En dev se deja vacío para que el LeadFormService SIMULE el envío
   * (console.log del payload + delay). El endpoint real del CRM tiene un
   * Origin allowlist que bloquea localhost — si quieren probarlo end-to-end
   * desde dev, pegen aquí temporalmente la URL de producción Y pidan al
   * equipo del CRM agregar `http://localhost:4200` al allowlist.
   */
  crmEndpoint: '',
  crmApiKey: ''
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
