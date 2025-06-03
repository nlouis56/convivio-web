import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-blue-600 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <a routerLink="/" class="text-2xl font-bold">Convivio</a>

        <nav>
          <ul class="flex space-x-6">
            <li><a routerLink="/" class="hover:text-blue-200">Home</a></li>
            <li><a routerLink="/events" class="hover:text-blue-200">Events</a></li>
            <li><a routerLink="/places" class="hover:text-blue-200">Places</a></li>

            @if (!authService.isLoggedIn) {
              <li><a routerLink="/login" class="hover:text-blue-200">Login</a></li>
              <li><a routerLink="/register" class="hover:text-blue-200">Register</a></li>
            } @else {
              @if (authService.hasRole('EVENT_CREATOR')) {
                <li><a routerLink="/events/create" class="hover:text-blue-200">Create Event</a></li>
              }
              <li><a routerLink="/profile" class="hover:text-blue-200">Profile</a></li>
              <li><button (click)="logout()" class="hover:text-blue-200">Logout</button></li>
            }
          </ul>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    header {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
    window.location.href = '/';
  }
}
