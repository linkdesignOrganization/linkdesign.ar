import { Component, OnInit, Inject, PLATFORM_ID  } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { I18nService } from '../../services/i18n.service';

declare var gtag: Function;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public i18n: I18nService
  ) { }

  ngOnInit(): void {
  }

  goTop() {
    if (isPlatformBrowser(this.platformId)) {
      // @ts-ignore
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }

  offerElement() {
    if (isPlatformBrowser(this.platformId)) {
      // @ts-ignore
      document.getElementById("oferta").scrollIntoView();
    }
  }

  projectElement() {
    if (isPlatformBrowser(this.platformId)) {
      // @ts-ignore
      document.getElementById("project").scrollIntoView();
    }
  }

  quoteElement() {
    if (isPlatformBrowser(this.platformId)) {
      // @ts-ignore
      document.getElementById("quote").scrollIntoView();
    }
  }

  handleWhatsappCopy() {
    // Llama a la función de Google Ads para registrar la conversión
    gtag('event', 'conversion', {
      'send_to': 'AW-16767245191/qSMFCN2ek-YZEIe3n7s-',
      'value': 5, // Puedes enviar un valor específico si lo deseas
      'currency': 'USD' // Opcional: añade la moneda si es aplicable
    });
  }

  handleEmailCopy() {
    // Llama a la función de Google Ads para registrar la conversión
    gtag('event', 'conversion', {
      'send_to': 'AW-16767245191/qSMFCN2ek-YZEIe3n7s-',
      'value': 25, // Puedes enviar un valor específico si lo deseas
      'currency': 'USD' // Opcional: añade la moneda si es aplicable
    });
  }

  handleWhatsappClick(isPhone:boolean) {
    if (isPlatformBrowser(this.platformId)) {
      var prefix = isPhone ? 'api' : 'web';

      const url = `https://${prefix}.whatsapp.com/send?phone=50672325943`;

      const callback = () => {
        window.open(url, '_blank'); // Redirige al enlace de WhatsApp después del evento de conversión
      };

      // Llama a la función de conversión de Google Ads
      gtag('event', 'conversion', {
        'send_to': 'AW-16767245191/qSMFCN2ek-YZEIe3n7s-',
        'value': 5, // Puedes enviar un valor específico si lo deseas
        'currency': 'USD', // Opcional: si quieres asignar un valor a esta conversión
        'event_callback': callback
      });

      // En caso de que `gtag` sea asíncrono y la redirección deba ser inmediata
      //setTimeout(callback, 1000);
    }
  }

  handlePhoneClick() {
    if (isPlatformBrowser(this.platformId)) {
      const phoneNumber = '+50672325943';
      const url = `tel:${phoneNumber}`;
    
      const callback = () => {
        window.location.href = url; // Redirige a la marcación telefónica después del evento de conversión
      };
    
      // Llama a la función de conversión de Google Ads
      gtag('event', 'conversion', {
        'send_to': 'AW-16767245191/qSMFCN2ek-YZEIe3n7s-', // Reemplaza con tu ID de conversión
        'value': 15,               // Puedes asignar el valor que desees
        'currency': 'USD',        // También es opcional
        'event_callback': callback
      });
    
      // En caso de que `gtag` sea asíncrono y quieras forzar la redirección si no sucede rápido:
      // setTimeout(callback, 1000);
    }
  }

  handlePhoneCopy() {
    // Llama a la función de Google Ads para registrar la conversión
    gtag('event', 'conversion', {
      'send_to': 'AW-16767245191/qSMFCN2ek-YZEIe3n7s-',
      'value': 15, // Puedes enviar un valor específico si lo deseas
      'currency': 'USD' // Opcional: añade la moneda si es aplicable
    });
  }




  setLang(lang: 'es' | 'en', event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.i18n.use(lang);
  }
}
