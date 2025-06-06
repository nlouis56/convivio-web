import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';

import { MapPickerComponent } from '../../../components/maps/map-picker.component';
import { PlaceService } from '../../../core/place.service';
import { PlaceDto } from '../../../models/place.model';
@Component({
  selector: 'app-place-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MapPickerComponent
  ],
  template: `
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Create New Place</h1>

      <form
        [formGroup]="placeForm"
        (ngSubmit)="onSubmit()"
        class="bg-white shadow-md rounded-lg p-6"
      >
        <!-- Name -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="name"
            >Place Name</label
          >
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            formControlName="name"
            placeholder="Enter place name"
          />
        </div>

        <!-- Description -->
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="description"
            >Description</label
          >
          <textarea
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            formControlName="description"
            placeholder="Place description"
            rows="4"
          ></textarea>
        </div>

        <!-- Map picker (child component) -->
        <div class="mb-6 h-[400px] w-full rounded overflow-hidden shadow">
          <app-map-picker
            [lat]="placeForm.get('latitude')?.value"
            [lng]="placeForm.get('longitude')?.value"
            (locationSelected)="onLocationSelected($event)"
          ></app-map-picker>
        </div>

        <!-- Coordinates read‑only -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="lat"
              >Latitude</label
            >
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
              id="lat"
              type="text"
              formControlName="latitude"
              readonly
            />
          </div>
          <div>
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="lng"
              >Longitude</label
            >
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
              id="lng"
              type="text"
              formControlName="longitude"
              readonly
            />
          </div>
        </div>

        <!-- Address -->
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="address"
            >Address</label
          >
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="address"
            type="text"
            formControlName="address"
            placeholder="Enter place address"
          />
        </div>

        <!-- Category -->
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="category"
            >Category</label
          >
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="category"
            type="text"
            formControlName="category"
            placeholder="What type of place is this? (restaurant, bar, park, etc.)"
          />
        </div>

        <div class="flex items-center justify-between">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            [disabled]="!placeForm.valid"
          >
            Create Place
          </button>
          <a routerLink="/places" class="text-blue-500 hover:underline">Cancel</a>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class PlaceCreateComponent {
  placeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private placeService: PlaceService,
    private router: Router
  ) {
    this.placeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      address: ['', Validators.required],
      latitude: [44.8673, Validators.required],
      longitude: [-0.5755, Validators.required],
      photoUrls: this.fb.array([]),
      amenities: this.fb.array([]),
      averageRating: [0],
    });
  }

  /** Receive coordinates (and optional address) from the child */
  onLocationSelected(ev: { lat: number; lng: number; address?: string }): void {
    this.placeForm.patchValue({
      latitude: ev.lat,
      longitude: ev.lng,
      address: ev.address ?? this.placeForm.value.address
    });
  }

  onSubmit(): void {
    if (this.placeForm.valid) {
      const placeData: PlaceDto = {
        name: this.placeForm.value.name,
        description: this.placeForm.value.description,
        category: this.placeForm.value.category,
        address: this.placeForm.value.address,
        location: [
          this.placeForm.value.latitude,
          this.placeForm.value.longitude
        ],
        photoUrls: [],
        amenities: [],
        averageRating: 0
      };
      this.placeService.create(placeData).subscribe({
        next: (place) => {
          console.log('Place created successfully:', place);
          this.router.navigate(['/places', place.id]);
        },
        error: (err) => {
          console.error('Error creating place:', err);
          alert('Failed to create place. Please try again later.');
        }
      });
    }
  }
}
