import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PlaceSelectorComponent } from '../../../components/places/place-selector.component';
import { EventService } from '../../../core/event.service';
import { EventCreateRequest } from '../../../models/event.model';
import { TranslatePipe } from "../../../core/translate.pipe";

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, PlaceSelectorComponent, TranslatePipe],
  template: `
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6 text-neutral">{{ 'events.create' | translate }}</h1>

      <form [formGroup]="eventForm" (ngSubmit)="onSubmit()" class="card p-6">
        <div class="mb-4">
          <label class="block text-neutral text-sm font-bold mb-2" for="title">
            {{ 'events.title' | translate }}
          </label>
          <input
            class="input"
            id="title"
            type="text"
            formControlName="title"
            placeholder="Enter event title"
          >
        </div>
        <div class="mb-4">
          <label class="block text-neutral text-sm font-bold mb-2" for="place">
            {{ 'places.place' | translate }}
          </label>

          <app-place-selector
            formControlName="place"
            label=""
            [helper]="'places.select' | translate"
          ></app-place-selector>
        </div>

        <div class="mb-4">
          <label class="block text-neutral text-sm font-bold mb-2" for="description">
            {{ 'events.description-field' | translate }}
          </label>
          <textarea
            class="input"
            id="description"
            formControlName="description"
            placeholder="Event description"
            rows="4"
          ></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-neutral text-sm font-bold mb-2">
            {{'events.max-participants' | translate }}
          </label>
          <input
            class="input"
            type="number"
            formControlName="maxParticipants"
            placeholder="Enter maximum number of participants"
          >
        </div>

        <div class="mb-4">
          <label class="block text-neutral text-sm font-bold mb-2">
            {{ 'events.dates-and-times' | translate }}
          </label>
          <div class="flex items-center mb-2">
            <label class="text-neutral text-sm font-medium mr-3 w-16" for="startTime">
              {{ 'misc.start' | translate }}:
            </label>
            <input
              class="input flex-1"
              id="startTime"
              type="datetime-local"
              formControlName="startTime"
              placeholder="Select start date and time"
            >
          </div>
          <div class="flex items-center">
            <label class="text-neutral text-sm font-medium mr-3 w-16" for="endTime">
              {{ 'misc.end' | translate }}:
            </label>
            <input
              class="input flex-1"
              id="endTime"
              type="datetime-local"
              formControlName="endTime"
              placeholder="Select end date and time"
            >
          </div>
        </div>

        <div class="flex items-center justify-between">
          <button
            [class]="(!eventForm.valid || isLoading) ? 
              'btn opacity-50 cursor-not-allowed' : 
              'btn'"
            type="submit"
            [disabled]="!eventForm.valid || isLoading"
          >
            <span *ngIf="!isLoading">{{ 'events.create' | translate }}</span>
            <span *ngIf="isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ 'info.loading' | translate }}
            </span>
          </button>
          <a routerLink="/events" class="link">{{ 'misc.cancel' | translate }}</a>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class EventCreateComponent {
  eventForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private eventService: EventService
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      maxParticipants: [null, [Validators.required, Validators.min(1)]],
      place: [null, Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.eventForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const eventData: EventCreateRequest = {
        title: this.eventForm.value.title,
        description: this.eventForm.value.description,
        maxParticipants: this.eventForm.value.maxParticipants,
        startDateTime: this.eventForm.value.startTime,
        endDateTime: this.eventForm.value.endTime,
        published: true,
      };
      this.eventService.createEvent(eventData, this.eventForm.value.place, "").subscribe({
        next: (response) => {
          alert('Event created successfully!');
          this.eventService.publishEvent(response.id).subscribe({
            next: () => {
              this.isLoading = false;
            },
            error: (error) => {
              console.error('Error publishing event:', error);
              alert('Event created but failed to publish. Please check the console for details and contact an administrator if necessary.');
              this.isLoading = false;
            }
          });
          this.router.navigate(['/events', response.id]);
        }
        , error: (error) => {
          console.error('Error creating event:', error);
          alert('Failed to create event. Please try again.');
          this.eventForm.reset();
          this.eventForm.markAsPristine();
          this.eventForm.markAsUntouched();
          this.eventForm.updateValueAndValidity();
          this.isLoading = false;
        }
      });
    }
  }
}
