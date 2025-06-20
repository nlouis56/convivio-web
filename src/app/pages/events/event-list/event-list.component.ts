import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../core/event.service';
import { Event } from '../../../models/event.model';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Events</h1>
      <p class="text-gray-600">Discover and join exciting events around you</p>
    </div>

    <div class="mb-8 flex flex-wrap gap-4">
      <button
        *ngFor="let filter of filters"
        (click)="applyFilter(filter.value)"
        [disabled]="isLoading"
        class="px-4 py-2 rounded-full transition"
        [class.cursor-not-allowed]="isLoading"
        [class.opacity-50]="isLoading"
        [class.bg-blue-600]="currentFilter === filter.value"
        [class.text-white]="currentFilter === filter.value"
        [class.bg-gray-200]="currentFilter !== filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- Loading indicator -->
    <div *ngIf="isLoading" class="flex justify-center items-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      <span class="ml-4 text-gray-600">Loading events...</span>
    </div>

    <!-- Once loading is done, show events or "no events" -->
    <ng-container *ngIf="!isLoading">
      <div *ngIf="events.length > 0; else noEventsTpl"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ng-container *ngFor="let event of events; trackBy: trackById">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <ng-container *ngIf="event.imageUrl; else noImageTpl">
              <img [src]="event.imageUrl"
                    [alt]="event.title"
                    class="w-full h-48 object-cover">
            </ng-container>
            <ng-template #noImageTpl>
              <div class="w-full h-48 bg-gray-300 flex items-center justify-center">
                <span class="text-gray-500">No image</span>
              </div>
            </ng-template>

            <div class="p-4">
              <h3 class="text-xl font-semibold mb-2">{{ event.title }}</h3>
              <p class="text-gray-500 mb-2">{{ formatDate(event.startDateTime) }}</p>
              <p class="mb-4">
                {{ event.description | slice:0:100 }}
                {{ event.description.length > 100 ? '…' : '' }}
              </p>

              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-600">
                  {{ event.participantCount || 0 }}/{{ event.maxParticipants }} participants
                </span>
                <span *ngIf="event.place?.name" class="text-sm text-gray-600">
                  {{ event.place.name }}
                </span>
              </div>

              <div class="flex justify-between items-center mt-4">
                <button
                  (click)="viewEventDetails(event.id)"
                  class="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  View details
                </button>

                <button
                  *ngIf="isLoggedIn"
                  (click)="joinEvent(event.id)"
                  [disabled]="isEventFull(event)"
                  class="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isEventFull(event) ? 'Full' : 'Join' }}
                </button>
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    </ng-container>

    <ng-template #noEventsTpl>
      <div class="col-span-full text-center py-10">
        <p class="text-gray-500 mb-4">No events found</p>
        <button
          *ngIf="isLoggedIn && hasCreatorRole"
          (click)="navigateToCreate()"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Create an Event
        </button>
      </div>
    </ng-template>

    <ng-container *ngIf="isLoggedIn && hasCreatorRole">
      <div class="fixed bottom-8 right-8">
        <button
          (click)="navigateToCreate()"
          class="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700">
          <span class="text-2xl">+</span>
        </button>
      </div>
    </ng-container>
  `,
  styles: []
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  isLoading = false;
  currentFilter = 'all';
  filters = [
    { label: 'All Events', value: 'all' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Ongoing', value: 'ongoing' },
    { label: 'Past', value: 'past' },
    { label: 'Available', value: 'available' },
    { label: 'Popular', value: 'popular' }
  ];

  constructor(
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get hasCreatorRole(): boolean {
    return this.authService.hasRole('EVENT_CREATOR');
  }

  applyFilter(filter: string): void {
    if (this.currentFilter === filter || this.isLoading) return;
    this.currentFilter = filter;
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;

    let request$ = (() => {
      switch (this.currentFilter) {
        case 'upcoming': return this.eventService.getUpcomingEvents();
        case 'ongoing':  return this.eventService.getOngoingEvents();
        case 'past':     return this.eventService.getPastEvents();
        case 'available':return this.eventService.getEventsWithAvailableSlots();
        case 'popular':  return this.eventService.getPopularEvents();
        default:         return this.eventService.getAllEvents();
      }
    })();

    request$.subscribe({
      next: evts => {
        this.events = evts;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error loading events', err);
        this.isLoading = false;
      }
    });
  }

  joinEvent(eventId: string): void {
    if (!this.isLoggedIn) return;
    this.eventService.joinEvent(eventId).subscribe({
      next: () => this.loadEvents(),
      error: err => console.error('Error joining event', err)
    });
  }

  viewEventDetails(eventId: string): void {
    // Navigate to event details
    window.location.href = `/events/${eventId}`;
  }

  navigateToCreate(): void {
    window.location.href = '/events/create';
  }

  isEventFull(event: Event): boolean {
    return !!event.participantCount && event.participantCount >= event.maxParticipants;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  trackById(_: number, evt: Event) {
    return evt.id;
  }
}
