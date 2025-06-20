import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EventService } from '../../../core/event.service';
import { Event } from '../../../models/event.model';
import { MapDisplayComponent } from '../../../components/maps/map-display.component';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MapDisplayComponent],
  template: `
    <!-- Loading state -->
    <ng-container *ngIf="isLoading; else loadedTpl">
      <div class="flex flex-col items-center justify-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        <span class="mt-4 text-gray-600">Loading event details...</span>
      </div>
    </ng-container>

    <!-- Loaded (or error) -->
    <ng-template #loadedTpl>
      <!-- Not found fallback -->
      <ng-container *ngIf="eventDetails; else notFoundTpl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          <div class="flex flex-col gap-6">
            <div class="bg-white shadow-md rounded-lg p-6">
              <h2 class="text-2xl font-bold mb-4">
                Event Details - {{ eventDetails.title }}
              </h2>
              <p class="text-gray-700 mb-2">
                <strong>Date:</strong>
                {{ eventDetails.startDateTime | date: 'fullDate' }}
              </p>
              <p class="text-gray-700 mb-2">
                <strong>Location:</strong>
                {{ eventDetails.place.address }}
              </p>
              <p class="text-gray-700 mb-2">
                <strong>Description:</strong>
                {{ eventDetails.description }}
              </p>
            </div>

            <div class="bg-white shadow-md rounded-lg p-6">
              <h2 class="text-2xl font-bold mb-4">Participation</h2>
              <p class="text-gray-700 mb-2">
                <strong>Current Participants:</strong>
                {{ eventDetails.participantCount ?? 'Be the first to join!' }}
              </p>
              <button
                class="bg-blue-600 text-white px-4 py-2 mt-3 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                (click)="toggleParticipation()"
                [disabled]="isLoading"
              >
                {{ isUserParticipant() ? 'Leave Event' : 'Join Event' }}
              </button>
            </div>
          </div>

          <app-map-display
            class="h-full"
            [lat]="eventDetails.place.location?.[0] || 0"
            [lng]="eventDetails.place.location?.[1] || 0"
          ></app-map-display>
        </div>

        <div class="mt-6">
          <a routerLink="/events" class="text-blue-600 hover:underline">
            ← Back to Events
          </a>
        </div>

        <div *ngIf="isLoggedIn && hasCreatorRole" class="fixed bottom-8 right-8">
          <a
            [routerLink]="['/events', eventId, 'edit']"
            class="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700"
          >
            <span class="text-2xl">✏️</span>
          </a>
        </div>
      </ng-container>

      <!-- Event not found -->
      <ng-template #notFoundTpl>
        <div class="text-center py-16">
          <p class="text-red-500 mb-4">Event not found.</p>
          <a routerLink="/events" class="text-blue-600 hover:underline">
            ← Back to Events
          </a>
        </div>
      </ng-template>
    </ng-template>
  `,
  styles: []
})
export class EventDetailComponent implements OnInit {
  eventId: string | null = null;
  eventDetails: Event | null = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private authService: AuthService
  ) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get hasCreatorRole(): boolean {
    return this.authService.hasRole('EVENT_CREATOR');
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    if (!this.eventId) {
      console.error('Event ID not found in route parameters');
      return;
    }

    this.isLoading = true;
    this.eventService.getEventById(this.eventId).subscribe({
      next: evt => {
        if (!evt) {
          console.error('Event not found for ID:', this.eventId);
        } else {
          this.eventDetails = evt;
          this.eventDetails.participantCount = evt.participants?.length || 0;
        }
        this.isLoading = false;
      },
      error: err => {
        console.error('Error fetching event details:', err);
        this.isLoading = false;
      }
    });
  }

  isUserParticipant(): boolean {
    const userId = this.authService.currentUserValue?.id;
    return (
      !!userId &&
      !!this.eventDetails?.participants?.some(p => p.id === userId)
    );
  }

  toggleParticipation(): void {
    if (!this.eventId || !this.eventDetails) return;

    const joinOrLeave$ = this.isUserParticipant()
      ? this.eventService.leaveEvent(this.eventId)
      : this.eventService.joinEvent(this.eventId);
    this.isLoading = true;
    joinOrLeave$.subscribe({
      next: () => {
        const parts = this.eventDetails!.participants || [];
        this.eventDetails!.participantCount =
          this.isUserParticipant()
            ? parts.length - 1
            : parts.length + 1;
        if (!this.isUserParticipant()) {
          this.eventDetails!.participants = parts.concat(
            this.authService.currentUserValue!
          );
        } else {
          this.eventDetails!.participants = parts.filter(
            p => p.id !== this.authService.currentUserValue!.id
          );
        }
        this.isLoading = false;
      },
      error: err => {
        console.error('Error toggling participation:', err);
        this.isLoading = false;
      }
    });
  }
}
