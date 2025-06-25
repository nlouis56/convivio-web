import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../../core/event.service';
import { PlaceService } from '../../core/place.service';
import { Event } from '../../models/event.model';
import { PlaceDto } from '../../models/place.model';
import { TranslatePipe } from '../../core/translate.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <div class="bg-blue-50 p-8 rounded-lg mb-8">
      <h1 class="text-4xl font-bold mb-4">{{ 'home.welcome' | translate }}</h1>
      <p class="text-lg mb-6">{{ 'home.description' | translate }}</p>
      <div class="flex gap-4">
        <a routerLink="/events" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">{{ 'events.browse' | translate }}</a>
        <a routerLink="/places" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">{{ 'places.browse' | translate }}</a>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <section>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">{{ 'events.upcoming' | translate }}</h2>
          <a routerLink="/events" class="text-blue-600 hover:underline">{{ 'misc.view-all' | translate }}</a>
        </div>

        <div class="space-y-4">
          @if (upcomingEvents.length > 0) {
            @for (event of upcomingEvents; track event.id) {
              <div class="bg-white p-4 rounded-lg shadow-md">
                <h3 class="text-xl font-semibold">{{ event.title }}</h3>
                <p class="text-gray-600">{{ formatDate(event.startDateTime) }}</p>
                <p class="mt-2">{{ event.description | slice:0:100 }}{{ event.description.length > 100 ? '...' : '' }}</p>
                <a [routerLink]="['/events', event.id]" class="text-blue-600 hover:underline mt-2 inline-block">{{ 'misc.view-details' | translate }}</a>
              </div>
            }
          } @else {
            <p>{{ 'misc.no-data' | translate }}</p>
          }
        </div>
      </section>

      <section>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">{{ 'places.popular' | translate }}</h2>
          <a routerLink="/places" class="text-blue-600 hover:underline">{{ 'misc.view-all' | translate }}</a>
        </div>

        <div class="space-y-4">
          @if (popularPlaces.length > 0) {
            @for (place of popularPlaces; track place.id) {
              <div class="bg-white p-4 rounded-lg shadow-md">
                <h3 class="text-xl font-semibold">{{ place.name }}</h3>
                <p class="text-gray-600">{{ place.category }} · {{ place.averageRating }}⭐</p>
                <p class="mt-2">{{ place.description | slice:0:100 }}{{ place.description.length > 100 ? '...' : '' }}</p>
                <a [routerLink]="['/places', place.id]" class="text-blue-600 hover:underline mt-2 inline-block">{{ 'misc.view-details' | translate }}</a>
              </div>
            }
          } @else {
            <p>{{ 'misc.no-data' | translate }}</p>
          }
        </div>
      </section>
    </div>
  `,
  styles: []
})
export class HomeComponent implements OnInit {
  upcomingEvents: Event[] = [];
  popularPlaces: PlaceDto[] = [];

  constructor(
    private eventService: EventService,
    private placeService: PlaceService
  ) {}

  ngOnInit(): void {
    this.loadUpcomingEvents();
    this.loadPopularPlaces();
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
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
