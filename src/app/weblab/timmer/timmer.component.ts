import { Component, OnDestroy, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-timmer',
  templateUrl: './timmer.component.html',
  styleUrls: ['./timmer.component.scss']
})
export class TimmerComponent implements OnInit, OnDestroy {
  private initTimeoutId?: number;
  private intervalId?: number;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.scheduleClockUpdates();
    }
  }

  ngOnDestroy(): void {
    if (this.initTimeoutId) {
      window.clearTimeout(this.initTimeoutId);
    }
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  }

  private scheduleClockUpdates() {
    this.updateClock();
    const now = new Date();
    const delay = Math.max(0, ((60 - now.getSeconds()) * 1000) - now.getMilliseconds());
    this.initTimeoutId = window.setTimeout(() => {
      this.updateClock();
      this.intervalId = window.setInterval(() => this.updateClock(), 60000);
    }, delay);
  }

  private updateClock() {
    const letters = document.querySelectorAll<HTMLElement>('.clock-letter');
    if (!letters.length) {
      return;
    }

    const clearTargets = ['a', 'quarter', 'twenty', 'half', 'ten', 'five', 'to', 'past', 'oclock'];
    for (let hour = 1; hour <= 12; hour += 1) {
      clearTargets.push(String(hour));
    }
    clearTargets.forEach((token) => this.toggleActive(letters, token, false));

    const now = new Date();
    const hour24 = now.getHours();
    const minute = now.getMinutes();
    const hour12 = hour24 % 12 || 12;
    const nextHour12 = ((hour12 % 12) + 1);

    if (minute >= 58) {
      this.toggleActive(letters, 'oclock', true);
      this.toggleActive(letters, String(nextHour12), true);
      return;
    }

    if (minute >= 52) {
      this.toggleActive(letters, 'five', true);
      this.toggleActive(letters, 'to', true);
      this.toggleActive(letters, String(nextHour12), true);
      return;
    }

    if (minute >= 49) {
      this.toggleActive(letters, 'ten', true);
      this.toggleActive(letters, 'to', true);
      this.toggleActive(letters, String(nextHour12), true);
      return;
    }

    if (minute >= 43) {
      this.toggleActive(letters, 'a', true);
      this.toggleActive(letters, 'quarter', true);
      this.toggleActive(letters, 'to', true);
      this.toggleActive(letters, String(nextHour12), true);
      return;
    }

    if (minute >= 36) {
      this.toggleActive(letters, 'twenty', true);
      this.toggleActive(letters, 'to', true);
      this.toggleActive(letters, String(nextHour12), true);
      return;
    }

    if (minute >= 26) {
      this.toggleActive(letters, 'half', true);
      this.toggleActive(letters, 'past', true);
      this.toggleActive(letters, String(hour12), true);
      return;
    }

    if (minute >= 19) {
      this.toggleActive(letters, 'twenty', true);
      this.toggleActive(letters, 'past', true);
      this.toggleActive(letters, String(hour12), true);
      return;
    }

    if (minute >= 13) {
      this.toggleActive(letters, 'a', true);
      this.toggleActive(letters, 'quarter', true);
      this.toggleActive(letters, 'past', true);
      this.toggleActive(letters, String(hour12), true);
      return;
    }

    if (minute >= 9) {
      this.toggleActive(letters, 'ten', true);
      this.toggleActive(letters, 'past', true);
      this.toggleActive(letters, String(hour12), true);
      return;
    }

    if (minute >= 3) {
      this.toggleActive(letters, 'five', true);
      this.toggleActive(letters, 'past', true);
      this.toggleActive(letters, String(hour12), true);
      return;
    }

    this.toggleActive(letters, 'oclock', true);
    this.toggleActive(letters, String(hour12), true);
  }

  private toggleActive(letters: NodeListOf<HTMLElement>, token: string, isActive: boolean) {
    letters.forEach((letter) => {
      if (!letter.classList.contains(token)) {
        return;
      }
      if (isActive) {
        letter.classList.add('active');
      } else {
        letter.classList.remove('active');
      }
    });
  }
}
