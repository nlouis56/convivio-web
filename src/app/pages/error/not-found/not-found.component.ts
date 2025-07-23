import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '../../../core/translate.pipe';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <div class="flex flex-col items-center justify-center py-16">
      <h1 class="text-6xl font-bold text-neutral mb-4">{{ 'error.404' | translate }}</h1>
      <h2 class="text-2xl font-semibold mb-6 text-neutral">{{ 'error.not-found' | translate }}</h2>
      <p class="text-neutral/70 mb-8 text-center max-w-md">
        {{ 'error.not-found.description' | translate }}
      </p>
      <a routerLink="/" class="btn">
        {{ 'misc.return-to-home' | translate }}
      </a>
    </div>
  `,
  styles: []
})
export class NotFoundComponent {}
