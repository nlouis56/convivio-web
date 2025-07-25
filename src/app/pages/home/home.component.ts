import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { EventService } from '../../core/event.service';
import { PlaceService } from '../../core/place.service';
import { LanguageService } from '../../core/language.service';
import { Event } from '../../models/event.model';
import { PlaceDto } from '../../models/place.model';
import { TranslatePipe } from '../../core/translate.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <div class="bg-muted p-8 rounded-lg mb-8">
      <h1 class="text-4xl font-bold mb-4 text-neutral">{{ 'home.welcome' | translate }}</h1>
      <p class="text-lg mb-6 text-neutral/80">{{ 'home.description' | translate }}</p>
      <div class="flex gap-4">
        <a routerLink="/events" class="btn">{{ 'events.browse' | translate }}</a>
        <a routerLink="/places" class="btn-accent">{{ 'places.browse' | translate }}</a>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <section>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-neutral">{{ 'events.upcoming' | translate }}</h2>
          <a routerLink="/events" class="link">{{ 'misc.view-all' | translate }}</a>
        </div>

        <div class="space-y-4">
          @if (upcomingEvents.length > 0) {
            @for (event of upcomingEvents; track event.id) {
              <div class="card p-4">
                <h3 class="text-xl font-semibold text-neutral">{{ event.title }}</h3>
                <p class="text-neutral/70">{{ formatDate(event.startDateTime) }}</p>
                <p class="mt-2 text-neutral/80">{{ event.description | slice:0:100 }}{{ event.description.length > 100 ? '...' : '' }}</p>
                <a [routerLink]="['/events', event.id]" class="link mt-2 inline-block">{{ 'misc.view-details' | translate }}</a>
              </div>
            }
          } @else {
            <p class="text-neutral/60">{{ 'misc.no-data' | translate }}</p>
          }
        </div>
      </section>

      <section>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-neutral">{{ 'places.popular' | translate }}</h2>
          <a routerLink="/places" class="link">{{ 'misc.view-all' | translate }}</a>
        </div>

        <div class="space-y-4">
          @if (popularPlaces.length > 0) {
            @for (place of popularPlaces; track place.id) {
              <div class="card p-4">
                <h3 class="text-xl font-semibold text-neutral">{{ place.name }}</h3>
                <p class="text-neutral/70">{{ place.category }} · {{ place.averageRating }}⭐</p>
                <p class="mt-2 text-neutral/80">{{ place.description | slice:0:100 }}{{ place.description.length > 100 ? '...' : '' }}</p>
                <a [routerLink]="['/places', place.id]" class="link mt-2 inline-block">{{ 'misc.view-details' | translate }}</a>
              </div>
            }
          } @else {
            <p class="text-neutral/60">{{ 'misc.no-data' | translate }}</p>
          }
        </div>
      </section>
    </div>
  `,
  styles: []
})
export class HomeComponent implements OnInit, OnDestroy {
  upcomingEvents: Event[] = [];
  popularPlaces: PlaceDto[] = [];

  private languageSubscription: Subscription = new Subscription();

  constructor(
    private eventService: EventService,
    private placeService: PlaceService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.loadUpcomingEvents();
    this.loadPopularPlaces();
    
    // Subscribe to language changes to update date formatting
    this.languageSubscription = this.languageService.currentLanguage$.subscribe(() => {
      // Trigger a re-render of the component by updating references
      this.upcomingEvents = [...this.upcomingEvents];
    });
  }

  ngOnDestroy(): void {
    this.languageSubscription.unsubscribe();
  }

  private loadUpcomingEvents(): void {
    this.eventService.getUpcomingEvents().subscribe({
      next: (events) => {
        this.upcomingEvents = events.slice(0, 3); // Show only first 3 events
      },
      error: (error) => {
        console.error('Error loading upcoming events', error);
      }
    });
  }

  private loadPopularPlaces(): void {
    this.placeService.getPopular(3).subscribe({
      next: (places) => {
        this.popularPlaces = places;
      },
      error: (error) => {
        console.error('Error loading popular places', error);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const currentLocale = this.languageService.getCurrentLanguage();
    return date.toLocaleDateString(currentLocale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
