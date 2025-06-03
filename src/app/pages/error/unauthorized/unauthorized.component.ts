import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex flex-col items-center justify-center py-16">
      <h1 class="text-6xl font-bold text-gray-800 mb-4">403</h1>
      <h2 class="text-2xl font-semibold mb-6">Access Denied</h2>
      <p class="text-gray-600 mb-8 text-center max-w-md">
        You don't have permission to access this page. If you believe this is an error, please contact the administrator.
      </p>
      <div class="flex gap-4">
        <a routerLink="/" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Return to Home
        </a>
        <a routerLink="/login" class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700">
          Log In
        </a>
      </div>
    </div>
  `,
  styles: []
})
export class UnauthorizedComponent {}
