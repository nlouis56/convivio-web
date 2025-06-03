import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-gray-800 text-white py-6 mt-auto">
      <div class="container mx-auto">
        <div class="text-center">
          <p>© {{ currentYear }} Convivio. All rights reserved.</p>
          <p class="text-sm mt-2">A social platform to discover events and places</p>
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
