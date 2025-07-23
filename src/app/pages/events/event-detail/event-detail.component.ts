import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EventService } from '../../../core/event.service';
import { Event } from '../../../models/event.model';
import { MapDisplayComponent } from '../../../components/maps/map-display.component';
import { ReviewListComponent } from '../../../components/reviews/review-list.component';
import { AuthService } from '../../../core/auth.service';
import { TranslatePipe } from "../../../core/translate.pipe";

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MapDisplayComponent, ReviewListComponent, TranslatePipe],
  template: `
    <!-- Loading state -->
    <ng-container *ngIf="isLoading; else loadedTpl">
      <div class="flex flex-col items-center justify-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-600"></div>
        <span class="mt-4 text-neutral-600">{{ 'events.loading-details' | translate }}</span>
      </div>
    </ng-container>

    <!-- Loaded (or error) -->
    <ng-template #loadedTpl>
      <!-- Not found fallback -->
      <ng-container *ngIf="eventDetails; else notFoundTpl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          <div class="flex flex-col gap-6">
            <div class="card p-4">
              <h2 class="text-2xl font-bold mb-4 text-neutral-800">
                {{ 'misc.details' | translate }} - {{ eventDetails.title }}
              </h2>
              <p class="text-neutral-700 mb-2">
                <strong>{{ 'events.date' | translate }}:</strong>
                {{ eventDetails.startDateTime | date: 'fullDate' }}
              </p>
              <p class="text-neutral-700 mb-2">
                <strong>{{ 'misc.location' | translate }}:</strong>
                {{ eventDetails.place.address }}
              </p>
              <p class="text-neutral-700 mb-2">
                <strong>{{ 'events.description-field' | translate }}:</strong>
                {{ eventDetails.description }}
              </p>
            </div>

            <div class="card p-4">
              <h2 class="text-2xl font-bold mb-4 text-neutral-800">{{ 'events.participants' | translate }}</h2>
              <p class="text-neutral-700 mb-2">
                <strong>{{ 'events.participants' | translate }}: </strong>
                {{ eventDetails.participantCount ?? ('events.first-to-join' | translate) }}
              </p>
              <button
                class="btn mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
                (click)="toggleParticipation()"
                [disabled]="isLoading"
              >
                {{ isUserParticipant() ? ('events.leave' | translate) : ('events.join' | translate) }}
              </button>
            </div>
          </div>

          <app-map-display
            class="h-full"
            [lat]="eventDetails.place.location?.[0] || 0"
            [lng]="eventDetails.place.location?.[1] || 0"
          ></app-map-display>
        </div>

        <!-- Reviews Section -->
        <div class="mt-8">
          <app-review-list
            resourceType="event"
            [resourceId]="eventId">
          </app-review-list>
        </div>

        <div class="mt-6">
          <a routerLink="/events" class="link">
            ← {{'events.back-to' | translate}}
          </a>
        </div>

        <div *ngIf="isLoggedIn && hasCreatorRole" class="fixed bottom-8 right-8">
          <a
            [routerLink]="['/events', eventId, 'edit']"
            class="flex items-center justify-center w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors"
          >
            <span class="text-2xl">✏️</span>
          </a>
        </div>
      </ng-container>

      <!-- Event not found -->
      <ng-template #notFoundTpl>
        <div class="text-center py-16">
          <p class="text-error mb-4">{{ 'events.not-found' | translate }}</p>
          <a routerLink="/events" class="link">
            ← {{ 'events.back-to-events' | translate }}
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
