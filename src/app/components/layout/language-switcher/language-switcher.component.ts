import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, Language } from '../../../core/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative inline-block text-left">
      <button
        type="button"
        class="inline-flex
                justify-center
                w-full
                px-4
                py-2
                text-sm
                font-medium
                text-white
                bg-primary-600
                border
                border-transparent
                rounded-md
                hover:bg-primary-700
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                focus:ring-primary-500
                transition-colors"
        (click)="toggleDropdown()"
        aria-expanded="true"
        aria-haspopup="true"
      >
        <span class="mr-2">{{ getCurrentLanguageFlag() }}</span>
        {{ getCurrentLanguageName() }}
        <svg
          class="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <div
        *ngIf="isDropdownOpen"
        class="origin-top-right
              absolute
              right-0
              mt-2
              w-56
              rounded-md
              shadow-lg
              bg-white ring-1
              ring-black
              ring-opacity-5
              focus:outline-none"
        style="z-index: 9999;"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabindex="-1"
      >
        <div class="py-1" role="none">
          <button
            *ngFor="let language of languageService.availableLanguages"
            type="button"
            class="flex
                  items-center
                  w-full
                  px-4
                  py-2
                  text-sm
                  text-gray-700
                  hover:bg-gray-100
                  hover:text-gray-900"
            [class.bg-gray-100]="language.code === getCurrentLanguage()"
            (click)="selectLanguage(language.code)"
            role="menuitem"
          >
            <span class="mr-3 p-1 bg-gray-200">{{ language.flag }}</span>
            {{ language.name }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      position: relative;
    }
  `]
})
export class LanguageSwitcherComponent {
  isDropdownOpen = false;

  constructor(public languageService: LanguageService) {}

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectLanguage(languageCode: string): void {
    this.languageService.setLanguage(languageCode);
    this.isDropdownOpen = false;
  }

  getCurrentLanguage(): string {
    return this.languageService.getCurrentLanguage();
  }

  getCurrentLanguageName(): string {
    return this.languageService.getLanguageName(this.getCurrentLanguage());
  }

  getCurrentLanguageFlag(): string {
    return this.languageService.getLanguageFlag(this.getCurrentLanguage());
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('app-language-switcher')) {
      this.isDropdownOpen = false;
    }
  }
}
