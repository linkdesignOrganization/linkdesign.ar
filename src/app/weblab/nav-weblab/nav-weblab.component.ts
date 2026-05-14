// @ts-ignore
// @ts-ignore
// @ts-ignore

import {Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { I18nService } from '../../services/i18n.service';
declare var gtag: Function;

@Component({
  selector: 'app-nav-weblab',
  templateUrl: './nav-weblab.component.html',
  styleUrls: ['./nav-weblab.component.scss']
})
export class NavWeblabComponent implements OnInit {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
  }

  private scrollToSection(sectionId: string, event?: Event) {
    if (event) {
      event.preventDefault();
    }

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const scroll = () => {
      const target = document.getElementById(sectionId);
      if (!target) {
        return;
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      const baseUrl = `${window.location.pathname}${window.location.search}`;
      history.replaceState(null, '', `${baseUrl}#${sectionId}`);
    };

    // Espera a que el menú colapse antes de hacer scroll.
    setTimeout(scroll, 250);
  }

  goTop(event?: Event) {
    this.scrollToSection('top', event);
  }

  enfoqueElement(event?: Event) {
    this.scrollToSection('enfoque', event);
  }

  labworkElement(event?: Event) {
    this.scrollToSection('labwork', event);
  }

  handleEmailCopy() {
    // Llama a la función de Google Ads para registrar la conversión
    gtag('event', 'conversion', {
      'send_to': 'AW-16767245191/qSMFCN2ek-YZEIe3n7s-',
      'value': 25, // Puedes enviar un valor específico si lo deseas
      'currency': 'USD' // Opcional: añade la moneda si es aplicable
    });
  }

  handleWhatsappClick(event: MouseEvent, isPhone:boolean) {
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
    }

    // En caso de que `gtag` sea asíncrono y la redirección deba ser inmediata
    //setTimeout(callback, 1000);
  }


  setLang(lang: 'es' | 'en', event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.i18n.use(lang);
  }
}
