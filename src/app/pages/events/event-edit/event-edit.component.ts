import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-event-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Edit Event</h1>

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

        <div class="flex items-center justify-between">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            [disabled]="!eventForm.valid"
          >
            Update Event
          </button>
          <a [routerLink]="['/events', eventId]" class="text-blue-500 hover:underline">Cancel</a>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class EventEditComponent implements OnInit {
  eventForm: FormGroup;
  eventId: string | null = null;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    // Here you would fetch the event data and patch form
    this.eventForm.patchValue({
      title: 'Sample Event Title',
      description: 'This is a sample event description for editing purposes.'
    });
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      console.log('Form submitted:', this.eventForm.value);
      // Update service call would go here
    }
  }
}
