import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PlaceSelectorComponent } from '../../../components/places/place-selector.component';
import { EventService } from '../../../core/event.service';
import { EventCreateRequest } from '../../../models/event.model';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, PlaceSelectorComponent],
  template: `
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Create New Event</h1>

      <form [formGroup]="eventForm" (ngSubmit)="onSubmit()" class="bg-white shadow-md rounded-lg p-6">
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
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            [disabled]="!eventForm.valid"
          >
            Create Event
          </button>
          <a routerLink="/events" class="text-blue-500 hover:underline">Cancel</a>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class EventCreateComponent {
  eventForm: FormGroup;

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
    if (this.eventForm.valid) {
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
            next: () => { },
            error: (error) => {
              console.error('Error publishing event:', error);
              alert('Event created but failed to publish. Please check the console for details and contact an administrator if necessary.');
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
        }
      });
    }
  }
}
