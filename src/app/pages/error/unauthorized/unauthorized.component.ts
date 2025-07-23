import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '../../../core/translate.pipe';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <div class="flex flex-col items-center justify-center py-16">
      <h1 class="text-6xl font-bold text-neutral mb-4">{{ 'error.403' | translate }}</h1>
      <h2 class="text-2xl font-semibold mb-6 text-neutral">{{ 'error.unauthorized' | translate }}</h2>
      <p class="text-neutral/70 mb-8 text-center max-w-md">
        {{ 'error.unauthorized.description' | translate }}
      </p>
      <div class="flex gap-4">
        <a routerLink="/" class="btn">
          {{ 'misc.return-to-home' | translate }}
        </a>
        <a routerLink="/login" class="btn-accent">
          {{ 'auth.login' | translate }}
        </a>
      </div>
    </div>
  `,
  styles: []
})
export class UnauthorizedComponent {}
