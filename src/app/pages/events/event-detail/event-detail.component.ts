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
  <ng-container *ngIf="eventDetails; else loading">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div class="flex flex-col gap-6">
        <div class="bg-white shadow-md rounded-lg p-6">
          <h2 class="text-2xl font-bold mb-4">Event Details - {{ eventDetails.title }}</h2>
          <p class="text-gray-700 mb-2"><strong>Date:</strong> {{ eventDetails.startDateTime | date: 'fullDate' }}</p>
          <p class="text-gray-700 mb-2"><strong>Location:</strong> {{ eventDetails.place.address }}</p>
          <p class="text-gray-700 mb-2"><strong>Description:</strong> {{ eventDetails.description }}</p>
        </div>

        <div class="bg-white shadow-md rounded-lg p-6">
          <h2 class="text-2xl font-bold mb-4">Participation</h2>
          <p class="text-gray-700 mb-2"><strong>Current Participants:</strong> {{ eventDetails.participantCount ?? "Be the first to join !" }}</p>
          <button
            class="bg-blue-600 text-white px-4 py-2 mt-3 rounded hover:bg-blue-700"
            (click)="toggleParticipation()"
          >
            {{ isUserParticipant() ? 'Leave Event' : 'Join Event' }}
          </button>
        </div>
      </div>

      <app-map-display
        class="h-full"
        [lat]="eventDetails.place.location?.at(0) || 0"
        [lng]="eventDetails.place.location?.at(1) || 0"
      ></app-map-display>
    </div>
    <div class="mt-6">
      <a routerLink="/events" class="text-blue-600 hover:underline">← Back to Events</a>
    </div>
    @if (isLoggedIn && hasCreatorRole) {
      <div class="fixed bottom-8 right-8">
        <a
          routerLink="/events/{{ eventId }}/edit"
          class="flex items-center justify-center w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700"
        >
          <span class="text-2xl">✏️</span>
        </a>
      </div>
    }
  </ng-container>
  <ng-template #loading>
    <p class="text-gray-500">Loading event details...</p>
  </ng-template>
  `,
  styles: []
})
export class EventDetailComponent implements OnInit {
  eventId: string | null = null;
  eventDetails: Event | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private authService: AuthService
  ) { }

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
    }
    this.eventService.getEventById(this.eventId!).subscribe({
      next: (event) => {
        if (!event) {
          console.error('Event not found for ID:', this.eventId);
          return;
        }
        console.log('Event details fetched successfully:', event);
        this.eventDetails = event;
        this.eventDetails.participantCount = event.participants?.length || 0;
      }
      , error: (err) => {
        console.error('Error fetching event details:', err);
      }
    });
  }

  isUserParticipant(): boolean {
    const userId = this.authService.currentUserValue?.id;
    if (!userId || !this.eventDetails?.participants) {
      return false;
    }
    return this.eventDetails.participants.some(participant => participant.id === userId);
  }

  toggleParticipation(): void {
    const userId = this.authService.currentUserValue?.id;
    if (!userId || !this.eventDetails) {
      console.error('User not logged in or event details not available');
      return;
    }

    if (this.isUserParticipant()) {
      // User is already a participant, remove them
      this.eventService.leaveEvent(this.eventId!).subscribe({
        next: () => {
          console.log('User left the event successfully');
          this.eventDetails!.participants = this.eventDetails!.participants?.filter(participant => participant.id !== userId) || [];
          this.eventDetails!.participantCount = this.eventDetails!.participants.length;
        },
        error: (err) => {
          console.error('Error leaving event:', err);
        }
      });
    } else {
      // User is not a participant, add them
      this.eventService.joinEvent(this.eventId!).subscribe({
        next: () => {
          console.log('User joined the event successfully');
          if (!this.eventDetails!.participants) {
            this.eventDetails!.participants = [];
          }
          this.eventDetails!.participantCount = this.eventDetails!.participants.length;
        },
        error: (err) => {
          console.error('Error joining event:', err);
        }
      });
    }
  }
}
