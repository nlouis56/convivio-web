import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PlaceSelectorComponent } from '../../../components/places/place-selector.component';
import { EventService } from '../../../core/event.service';
import { Event, EventCreateRequest, EventUpdateRequest } from '../../../models/event.model';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-event-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, PlaceSelectorComponent],
  template: `
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Edit {{event?.title}}</h1>

      <form [formGroup]="eventEditForm" (ngSubmit)="onSubmit()" class="bg-white shadow-md rounded-lg p-6">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
            Event Title
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            formControlName="title"
            placeholder="Enter event title"
          >
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="place">
            Place
          </label>

          <app-place-selector
            formControlName="place"
            [defaultPlaceId]="event?.place"
            label="Select a place"
            helper="Choose the location for your event"
          ></app-place-selector>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
            Description
          </label>
          <textarea
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            formControlName="description"
            placeholder="Event description"
            rows="4"
          ></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Maximum number of participants
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            formControlName="maxParticipants"
            placeholder="Enter maximum number of participants"
          >
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Dates and times
          </label>
          <div class="flex items-center mb-2">
            <label class="text-gray-700 text-sm font-medium mr-3 w-16" for="startTime">
              Start:
            </label>
            <input
              class="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="startTime"
              type="datetime-local"
              formControlName="startTime"
              placeholder="Select start date and time"
            >
          </div>
          <div class="flex items-center">
            <label class="text-gray-700 text-sm font-medium mr-3 w-16" for="endTime">
              End:
            </label>
            <input
              class="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="endTime"
              type="datetime-local"
              formControlName="endTime"
              placeholder="Select end date and time"
            >
          </div>
        </div>



        <div class="flex items-center justify-between">
          <!-- Left: Update & Delete buttons -->
          <div class="flex gap-2">
            <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            [disabled]="!eventEditForm.valid"
            >
              Update Event
            </button>
            <button
              class="bg-gray-300 hover:bg-red-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              (click)="onDelete()"
            >
              Delete Event
            </button>
          </div>
          <!-- Right: Validity checks & Cancel -->
          <div class="flex flex-col items-end gap-1">
            <span class="text-red-500" *ngIf="eventEditForm.invalid && eventEditForm.touched">
              Please fill out all required fields correctly.
            </span>
            <span class="text-green-500" *ngIf="eventEditForm.valid && eventEditForm.touched">
              Form is valid!
            </span>
            <span class="text-gray-500" *ngIf="eventEditForm.pristine">
              No changes made yet.
            </span>
            <a routerLink="/events" class="text-blue-500 hover:underline">Cancel</a>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class EventEditComponent implements OnInit {
  eventEditForm: FormGroup;
  eventId: string | null = null;
  event: Event | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) {
    this.eventEditForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      place: ['', Validators.required],
      maxParticipants: [10, [Validators.required, Validators.min(1)]],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    if (!this.eventId) {
      console.error('Event ID is missing in the route parameters.');
      return;
    }
    this.eventService.getEventById(this.eventId!).subscribe({
      next: (event) => {
        if (!event) {
          console.error('Event not found for ID:', this.eventId);
          return;
        }
        this.event = event;
        this.event.participantCount = event.participants?.length || 0;
        this.refreshFormContents();
      },
      error: (err) => {
        console.error('Error fetching event details:', err);
      }
    });
  }

  refreshFormContents(): void {
    if (this.event) {
      this.eventEditForm.patchValue({
        title: this.event.title || '',
        description: this.event.description || '',
        place: this.event.place.id || '',
        maxParticipants: this.event.maxParticipants || 10,
        startTime: this.event.startDateTime || '',
        endTime: this.event.endDateTime || ''
      });
    }
  }

  onSubmit(): void {
    if (this.eventEditForm.valid && this.eventId) {
      const updatedEvent: EventUpdateRequest = {
        id: this.eventId,
        title: this.eventEditForm.value.title,
        description: this.eventEditForm.value.description,
        maxParticipants: this.eventEditForm.value.maxParticipants,
        startDateTime: this.eventEditForm.value.startTime,
        endDateTime: this.eventEditForm.value.endTime
      };
      this.eventService.updateEvent(updatedEvent, this.eventEditForm.value.place).subscribe({
        next: (response) => {
          alert('Event updated successfully!');
          this.router.navigate(['/events']);
        },
        error: (err) => {
          console.error('Error updating event:', err);
        }
      });
    }
  }

  onDelete(): void {
    if (!this.eventId) return;
    const confirmed = window.confirm('Are you sure you want to delete this event?');
    if (confirmed) {
      this.eventService.deleteEvent(this.eventId).subscribe({
        next: () => {
          alert('Event deleted successfully!');
          this.router.navigate(['/events']);
        },
        error: (err) => {
          console.error('Error deleting event:', err);
        }
      });
    }
  }
}
