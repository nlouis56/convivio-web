import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EventService } from '../../../core/event.service';
import { Event } from '../../../models/event.model';
import { AuthService } from '../../../core/auth.service';
import { LanguageService } from '../../../core/language.service';
import { TranslatePipe } from '../../../core/translate.pipe';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslatePipe],
  template: `
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2 text-neutral">{{'nav.events' | translate}}</h1>
      <p class="text-neutral/70">{{ 'events.description' | translate }}</p>
    </div>

    <div class="mb-8 flex flex-wrap gap-4">
      <button
        *ngFor="let filter of filters"
        (click)="applyFilter(filter.value)"
        [disabled]="isLoading"
        class="px-4 py-2 rounded-full transition-colors"
        [class.cursor-not-allowed]="isLoading"
        [class.opacity-50]="isLoading"
        [class.bg-primary-600]="currentFilter === filter.value"
        [class.text-white]="currentFilter === filter.value"
        [class.bg-gray-200]="currentFilter !== filter.value"
        [class.text-neutral]="currentFilter !== filter.value"
      >
        {{ filter.label | translate }}
      </button>
    </div>

    <!-- Loading indicator -->
    <div *ngIf="isLoading" class="flex justify-center items-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-600"></div>
      <span class="ml-4 text-neutral/70">{{'info.loading' | translate}}</span>
    </div>

    <!-- Once loading is done, show events or "no events" -->
    <ng-container *ngIf="!isLoading">
      <div *ngIf="events.length > 0; else noEventsTpl"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ng-container *ngFor="let event of events; trackBy: trackById">
          <div class="card overflow-hidden">
            <ng-container *ngIf="event.imageUrl; else noImageTpl">
              <img [src]="event.imageUrl"
                    [alt]="event.title"
                    class="w-full h-48 object-cover">
            </ng-container>
            <ng-template #noImageTpl>
              <div class="w-full h-48 bg-gray-300 flex items-center justify-center">
                <span class="text-neutral/60">{{ 'events.no-image' | translate }}</span>
              </div>
            </ng-template>

            <div class="p-4">
              <h3 class="text-xl font-semibold mb-2 text-neutral">{{ event.title }}</h3>
              <p class="text-neutral/60 mb-2">{{ formatDate(event.startDateTime) }}</p>
              <p class="mb-4 text-neutral/80">
                {{ event.description | slice:0:100 }}
                {{ event.description.length > 100 ? '…' : '' }}
              </p>

              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-neutral/70">
                  {{ event.participantCount || 0 }}/{{ event.maxParticipants }} {{ 'form.participants' | translate }}
                </span>
                <span *ngIf="event.place?.name" class="text-sm text-neutral/70">
                  {{ event.place.name }}
                </span>
              </div>

              <div class="flex justify-between items-center mt-4">
                <button
                  (click)="viewEventDetails(event.id)"
                  class="btn">
                  {{'misc.view-details' | translate}}
                </button>

                <button
                  *ngIf="isLoggedIn"
                  (click)="joinEvent(event.id)"
                  [disabled]="isEventFull(event)"
                  class="btn-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isEventFull(event) ? ('events.full' | translate) : ('events.join' | translate) }}
                </button>
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    </ng-container>

    <ng-template #noEventsTpl>
      <div class="col-span-full text-center py-10">
        <p class="text-neutral/60 mb-4">{{'misc.no-data' | translate}}</p>
        <button
          *ngIf="isLoggedIn && hasCreatorRole"
          (click)="navigateToCreate()"
          class="btn">
          {{'events.create' | translate}}
        </button>
      </div>
    </ng-template>

    <ng-container *ngIf="isLoggedIn && hasCreatorRole">
      <div class="fixed bottom-8 right-8">
        <button
          (click)="navigateToCreate()"
          class="flex items-center justify-center w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors">
          <span class="text-2xl">+</span>
        </button>
      </div>
    </ng-container>
  `,
  styles: []
})
export class EventListComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  isLoading = false;
  currentFilter = 'all';
  filters = [
    { label: 'events.all', value: 'all' },
    { label: 'events.upcoming', value: 'upcoming' },
    { label: 'events.ongoing', value: 'ongoing' },
    { label: 'events.past', value: 'past' },
    { label: 'events.available', value: 'available' },
    { label: 'events.popular', value: 'popular' }
  ];

  private languageSubscription: Subscription = new Subscription();

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    
    // Subscribe to language changes to update date formatting
    this.languageSubscription = this.languageService.currentLanguage$.subscribe(() => {
      // Trigger a re-render of the component by updating a reference
      // This will cause the formatDate method to be called again with the new locale
      this.events = [...this.events];
    });
  }

  ngOnDestroy(): void {
    this.languageSubscription.unsubscribe();
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
    const currentLocale = this.languageService.getCurrentLanguage();
    return date.toLocaleDateString(currentLocale, {
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
