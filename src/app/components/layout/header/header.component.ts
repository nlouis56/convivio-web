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
    <header class="bg-primary-500 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <a routerLink="/" class="text-2xl font-bold hover:text-primary-100 transition-colors">Convivio</a>

        <nav class="flex items-center space-x-6">
          <ul class="flex space-x-6">
            <li><a routerLink="/" class="hover:text-primary-200 transition-colors">{{ 'nav.home' | translate }}</a></li>
            <li><a routerLink="/events" class="hover:text-primary-200 transition-colors">{{ 'nav.events' | translate }}</a></li>
            <li><a routerLink="/places" class="hover:text-primary-200 transition-colors">{{ 'nav.places' | translate }}</a></li>

            @if (!authService.isLoggedIn) {
              <li><a routerLink="/login" class="hover:text-primary-200 transition-colors">{{ 'nav.login' | translate }}</a></li>
              <li><a routerLink="/register" class="hover:text-primary-200 transition-colors">{{ 'nav.register' | translate }}</a></li>
            } @else {
              <li><a routerLink="/profile" class="hover:text-primary-200 transition-colors">{{ 'nav.profile' | translate }}</a></li>
              <li><button (click)="logout()" class="hover:text-primary-200 transition-colors">{{ 'nav.logout' | translate }}</button></li>
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
