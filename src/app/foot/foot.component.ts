import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

declare var gtag: Function;

/**
 * Rutas en las que el form del footer NO se debe mostrar.
 * (En /politicas-de-privacidad porque es la propia política,
 * en /404 porque no aporta valor en una página de error).
 */
const HIDE_FORM_ROUTES: string[] = [
  '/politicas-de-privacidad'
];

@Component({
  selector: 'app-foot',
  templateUrl: './foot.component.html',
  styleUrls: ['./foot.component.scss']
})
export class FootComponent implements OnInit, OnDestroy {
  /** Si true, se renderiza `<app-lead-form>` en la segunda columna del footer. */
  showForm = true;

  /**
   * Visibilidad de la sección "Nuestra oferta" (Estrategia/Desarrollo/Diseño/Contenido).
   * Ocultada para que el formulario tome todo el espacio horizontal disponible.
   * El bloque se conserva en el HTML por si en el futuro se reactiva.
   */
  showServicesSection = false;

  /** Feedback visual del botón de copiar email. Se resetea solo después de ~2s. */
  emailCopied = false;
  private emailCopyResetTimer?: any;
  private readonly emailAddress = 'hola@linkdesign.cr';

  private routerSub?: Subscription;
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Calcular estado inicial
    this.showForm = this.shouldShowForm(this.router.url);

    // Reaccionar a navegaciones
    this.routerSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((event) => {
        const next = this.shouldShowForm(event.urlAfterRedirects || event.url);
        if (next !== this.showForm) {
          this.showForm = next;
          this.cdr.detectChanges();
        }
      });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    if (this.emailCopyResetTimer) {
      clearTimeout(this.emailCopyResetTimer);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Copiar correo al portapapeles (con feedback visual)
  // ──────────────────────────────────────────────────────────────────────────

  copyEmail(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.isBrowser) return;

    const onSuccess = () => {
      this.emailCopied = true;
      this.cdr.detectChanges();

      if (this.emailCopyResetTimer) clearTimeout(this.emailCopyResetTimer);
      this.emailCopyResetTimer = setTimeout(() => {
        this.emailCopied = false;
        this.cdr.detectChanges();
      }, 2000);

      // Reutilizamos el evento de conversión existente para email
      this.handleEmailCopy();
    };

    // API moderna (clipboard API) — funciona en contextos seguros (HTTPS/localhost)
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(this.emailAddress)
        .then(onSuccess)
        .catch(() => this.copyWithFallback(this.emailAddress, onSuccess));
    } else {
      this.copyWithFallback(this.emailAddress, onSuccess);
    }
  }

  /**
   * Fallback con document.execCommand para browsers viejos o contextos no seguros.
   */
  private copyWithFallback(text: string, onSuccess: () => void): void {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      textarea.style.top = '0';
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, text.length);
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (ok) {
        onSuccess();
      }
    } catch {
      /* sin clipboard disponible — ignorar silenciosamente */
    }
  }

  /**
   * Reglas:
   *  - Esconder en rutas en HIDE_FORM_ROUTES (privacidad).
   *  - Esconder en rutas no reconocidas (lo que cae al NotFoundComponent / 404).
   *    El sitio tiene rutas: '', corporate, weblab, creative, contact, software,
   *    politicas-de-privacidad. Lo demás cae en wildcard ** → 404.
   */
  private shouldShowForm(url: string): boolean {
    if (!url) return true;
    // Normalizar: quitar query y hash
    const path = url.split('?')[0].split('#')[0];

    // Ocultar explícitamente
    for (const hidden of HIDE_FORM_ROUTES) {
      if (path === hidden || path.startsWith(hidden + '/')) return false;
    }

    // Lista de rutas válidas conocidas
    const validRoots = ['/corporate', '/weblab', '/creative', '/contact', '/software'];
    for (const root of validRoots) {
      if (path === root || path.startsWith(root + '/') || path.startsWith(root + '?')) return true;
    }

    // El home no muestra footer (app.component.ts ya lo controla), pero por las dudas:
    if (path === '/' || path === '') return false;

    // Cualquier otra ruta = 404 (NotFoundComponent) → esconder
    return false;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Handlers existentes (siguen usándose en otros elementos del footer)
  // ──────────────────────────────────────────────────────────────────────────

  handleEmailCopy() {
    if (typeof gtag !== 'function') return;
    gtag('event', 'conversion', {
      'send_to': 'AW-16767245191/qSMFCN2ek-YZEIe3n7s-',
      'value': 25,
      'currency': 'USD'
    });
  }

  handleWhatsappClick(event: MouseEvent, isPhone: boolean) {
    if (this.isBrowser) {
      var prefix = isPhone ? 'api' : 'web';
      const url = `https://${prefix}.whatsapp.com/send?phone=50672325943`;

      const callback = () => {
        window.open(url, '_blank');
      };

      if (typeof gtag === 'function') {
        gtag('event', 'conversion', {
          'send_to': 'AW-16767245191/qSMFCN2ek-YZEIe3n7s-',
          'value': 5,
          'event_callback': callback
        });
      } else {
        callback();
      }

      setTimeout(callback, 1000);
    }
  }
}
