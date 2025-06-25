import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { TranslatePipe } from '../../../core/translate.pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageSwitcherComponent, TranslatePipe],
  template: `
    <header class="bg-blue-600 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <a routerLink="/" class="text-2xl font-bold">Convivio</a>

        <nav class="flex items-center space-x-6">
          <ul class="flex space-x-6">
            <li><a routerLink="/" class="hover:text-blue-200">{{ 'nav.home' | translate }}</a></li>
            <li><a routerLink="/events" class="hover:text-blue-200">{{ 'nav.events' | translate }}</a></li>
            <li><a routerLink="/places" class="hover:text-blue-200">{{ 'nav.places' | translate }}</a></li>

            @if (!authService.isLoggedIn) {
              <li><a routerLink="/login" class="hover:text-blue-200">{{ 'nav.login' | translate }}</a></li>
              <li><a routerLink="/register" class="hover:text-blue-200">{{ 'nav.register' | translate }}</a></li>
            } @else {
              <li><a routerLink="/profile" class="hover:text-blue-200">{{ 'nav.profile' | translate }}</a></li>
              <li><button (click)="logout()" class="hover:text-blue-200">{{ 'nav.logout' | translate }}</button></li>
            }
          </ul>
          <app-language-switcher></app-language-switcher>
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
