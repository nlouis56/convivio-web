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
      <h1 class="text-6xl font-bold text-gray-800 mb-4">{{ 'error.403' | translate }}</h1>
      <h2 class="text-2xl font-semibold mb-6">{{ 'error.unauthorized' | translate }}</h2>
      <p class="text-gray-600 mb-8 text-center max-w-md">
        {{ 'error.unauthorized.description' | translate }}
      </p>
      <div class="flex gap-4">
        <a routerLink="/" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          {{ 'misc.return-to-home' | translate }}
        </a>
        <a routerLink="/login" class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700">
          {{ 'auth.login' | translate }}
        </a>
      </div>
    </div>
  `,
  styles: []
})
export class UnauthorizedComponent {}
