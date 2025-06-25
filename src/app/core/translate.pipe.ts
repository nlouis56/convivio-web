import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { LanguageService } from './language.service';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Make it impure so it updates when language changes
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private subscription?: Subscription;
  private lastKey = '';
  private lastValue = '';

  constructor(private languageService: LanguageService) {}

  transform(key: string): string {
    if (key !== this.lastKey) {
      this.lastKey = key;
      this.updateValue();
      // Subscribe to language changes if not already subscribed
      if (!this.subscription) {
        this.subscription = this.languageService.currentLanguage$.subscribe(() => {
          this.updateValue();
        });
      }
    }
    return this.lastValue;
  }

  private updateValue(): void {
    this.lastValue = this.languageService.translate(this.lastKey);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
