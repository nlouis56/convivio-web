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
import { TranslatePipe } from '../../../core/translate.pipe';

@Component({
  selector: 'app-place-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MapPickerComponent,
    TranslatePipe
  ],
  template: `
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">{{ 'places.create' | translate }}</h1>

      <form
        [formGroup]="placeForm"
        (ngSubmit)="onSubmit()"
        class="card p-6"
      >
        <!-- Name -->
        <div class="mb-4">
          <label class="block text-neutral text-sm font-bold mb-2" for="name"
            >{{ 'places.name' | translate }}</label
          >
          <input
            class="input"
            id="name"
            type="text"
            formControlName="name"
            placeholder="Enter place name"
          />
        </div>

        <!-- Description -->
        <div class="mb-4">
          <label
            class="block text-neutral text-sm font-bold mb-2"
            for="description"
            >{{ 'places.description-field' | translate }}</label
          >
          <textarea
            class="input"
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
              class="block text-neutral text-sm font-bold mb-2"
              for="lat"
              >{{ 'places.latitude' | translate }}</label
            >
            <input
              class="input bg-surface"
              id="lat"
              type="text"
              formControlName="latitude"
              readonly
            />
          </div>
          <div>
            <label
              class="block text-neutral text-sm font-bold mb-2"
              for="lng"
              >{{ 'places.longitude' | translate }}</label
            >
            <input
              class="input bg-surface"
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
            class="block text-neutral text-sm font-bold mb-2"
            for="address"
            >{{ 'places.address' | translate }}</label
          >
          <input
            class="input"
            id="address"
            type="text"
            formControlName="address"
            placeholder="Enter place address"
          />
        </div>

        <!-- Category -->
        <div class="mb-4">
          <label
            class="block text-neutral text-sm font-bold mb-2"
            for="category"
            >{{ 'places.category' | translate }}</label
          >
          <input
            class="input"
            id="category"
            type="text"
            formControlName="category"
            placeholder="{{ 'places.category-placeholder' | translate }}"
          />
        </div>

        <div class="flex items-center justify-between">
          <button
            class="btn"
            type="submit"
            [disabled]="!placeForm.valid"
          >
            {{ 'places.create' | translate }}
          </button>
          <a routerLink="/places" class="link">{{ 'misc.cancel' | translate }}</a>
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
