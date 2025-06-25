import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../core/translate.pipe';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <footer class="bg-gray-800 text-white py-6 mt-auto">
      <div class="container mx-auto">
        <div class="text-center">
          <p>© {{ currentYear }} Convivio.</p>
          <p class="text-sm mt-2">{{ 'footer.description' | translate }}</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    footer {
      margin-top: auto;
    }
  `]
})
export class FooterComponent {
  get currentYear(): number {
    return new Date().getFullYear();
  }
}
