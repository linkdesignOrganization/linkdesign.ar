import { Component, OnInit, Inject, PLATFORM_ID  } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-glitch',
  templateUrl: './glitch.component.html',
  styleUrls: ['./glitch.component.scss']
})
export class GlitchComponent implements OnInit {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
  }

  goTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
  }
}

}
