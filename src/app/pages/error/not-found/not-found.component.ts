import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex flex-col items-center justify-center py-16">
      <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 class="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p class="text-gray-600 mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <a routerLink="/" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
        Return to Home
      </a>
    </div>
  `,
  styles: []
})
export class NotFoundComponent {}
