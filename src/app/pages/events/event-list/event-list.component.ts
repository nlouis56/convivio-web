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
        class="px-4 py-2 rounded-full"
        [class.bg-blue-600]="currentFilter === filter.value"
        [class.text-white]="currentFilter === filter.value"
        [class.bg-gray-200]="currentFilter !== filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      @if (events.length > 0) {
        @for (event of events; track event.id) {
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            @if (event.imageUrl) {
              <img [src]="event.imageUrl" alt="{{ event.title }}" class="w-full h-48 object-cover">
            } @else {
              <div class="w-full h-48 bg-gray-300 flex items-center justify-center">
                <span class="text-gray-500">No image</span>
              </div>
            }

            <div class="p-4">
              <h3 class="text-xl font-semibold mb-2">{{ event.title }}</h3>
              <p class="text-gray-500 mb-2">{{ formatDate(event.startDateTime) }}</p>
              <p class="mb-4">{{ event.description | slice:0:100 }}{{ event.description.length > 100 ? '...' : '' }}</p>

              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-600">
                  {{ event.participantCount || 0 }}/{{ event.maxParticipants }} participants
                </span>
                @if (event.place?.name) {
                  <span class="text-sm text-gray-600">{{ event.place.name }}</span>
                }
              </div>

              <div class="flex justify-between items-center mt-4">
                <a [routerLink]="['/events', event.id]" class="text-blue-600 hover:underline">View details</a>

                @if (isLoggedIn) {
                  <button
                    (click)="joinEvent(event.id)"
                    class="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    [disabled]="isEventFull(event)"
                  >
                    {{ isEventFull(event) ? 'Full' : 'Join' }}
                  </button>
                }
              </div>
            </div>
          </div>
        }
      } @else {
        <div class="col-span-full text-center py-10">
          <p class="text-gray-500 mb-4">No events found</p>
          @if (isLoggedIn && hasCreatorRole) {
            <a
              routerLink="/events/create"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create an Event
            </a>
          }
        </div>
      }
    </div>

    @if (isLoggedIn && hasCreatorRole) {
      <div class="fixed bottom-8 right-8">
        <a
          routerLink="/events/create"
          class="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700"
        >
          <span class="text-2xl">+</span>
        </a>
      </div>
    }
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
    this.currentFilter = filter;
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    let request;

    switch (this.currentFilter) {
      case 'upcoming':
        request = this.eventService.getUpcomingEvents();
        break;
      case 'ongoing':
        request = this.eventService.getOngoingEvents();
        break;
      case 'past':
        request = this.eventService.getPastEvents();
        break;
      case 'available':
        request = this.eventService.getEventsWithAvailableSlots();
        break;
      case 'popular':
        request = this.eventService.getPopularEvents();
        break;
      default:
        request = this.eventService.getAllEvents();
    }

    request.subscribe({
      next: (events) => {
        this.events = events;
        this.isLoading = false;
        console.log('Events loaded successfully', this.events);
      },
      error: (error) => {
        console.error('Error loading events', error);
        this.isLoading = false;
      }
    });
  }

  joinEvent(eventId: string): void {
    if (!this.isLoggedIn) {
      // Redirect to login
      return;
    }

    this.eventService.joinEvent(eventId).subscribe({
      next: () => {
        // Refresh event list after joining
        this.loadEvents();
      },
      error: (error) => {
        console.error('Error joining event', error);
      }
    });
  }

  isEventFull(event: Event): boolean {
    return !!event.participantCount && event.participantCount >= event.maxParticipants;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
