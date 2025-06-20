import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PlaceDto } from '../../../models/place.model';
import { PlaceService } from '../../../core/place.service';
import { AuthService } from '../../../core/auth.service';
import { MapDisplayComponent } from '../../../components/maps/map-display.component';


@Component({
  selector: 'app-place-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MapDisplayComponent
  ],
  template: `
    <div class="max-w-5xl mx-auto">
      <!-- Heading -->
      <h1 class="text-3xl font-bold mb-2">Place Details</h1>
      <p class="text-gray-600 mb-6">Place ID: {{ placeId }}</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Details card -->
        <div class="bg-white shadow-md rounded-lg p-6">
          <ng-container *ngIf="placeDTO; else loading">
            <h2 class="text-2xl font-semibold mb-2">
              {{ placeDTO.name }}
            </h2>

            <p class="text-gray-700 mb-4">
              {{ placeDTO.description }}
            </p>

            <div class="mb-4">
              <strong>Category:</strong> {{ placeDTO.category }}
            </div>

            <div class="mb-4">
              <strong>Address:</strong> {{ placeDTO.address }}
              <button
                class="ml-2 text-blue-600 hover:underline"
                (click)="openGmaps(placeDTO)"
                *ngIf="placeDTO"
              >
                View on Google Maps
              </button>
            </div>

            <div class="mb-4">
              <strong>Average Rating:</strong>
              <span *ngIf="placeDTO.averageRating as avg">
                {{ avg.toFixed(1) }}
              </span>
              <span *ngIf="!placeDTO.averageRating">
                Not rated yet
              </span>
            </div>

            <div class="mb-4">
              <strong>Photos:</strong>
              <div
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
              >
                <img
                  *ngFor="let photo of placeDTO.photoUrls"
                  [src]="photo"
                  [alt]="placeDTO.name"
                  class="w-full h-auto rounded-lg shadow-sm"
                />
              </div>
            </div>
          </ng-container>

          <ng-template #loading>
            <p class="text-gray-500">Loading place details...</p>
          </ng-template>
        </div>

        <!-- MapDisplay on the side -->
        <app-map-display
            [lat]="placeDTO?.location?.at(0) || 0"
            [lng]="placeDTO?.location?.at(1) || 0"
          ></app-map-display>
      </div>

      <div
        class="bg-white shadow-md rounded-lg p-6 mt-8"
        *ngIf="placeDTO; else noPlace"
      >
        <h2 class="text-2xl font-semibold mb-4">Reviews</h2>

        <ng-container

        >
          <div

            class="border-b border-gray-200 pb-4 mb-4 last:border-none last:mb-0"
          >
            <p class="font-medium">
              Username
              <span class="text-sm text-gray-500 ml-2">
                rating/5
              </span>
            </p>
            <p class="text-gray-700">comment</p>
          </div>
        </ng-container>

        <ng-template #noReviews>
          <p class="text-gray-500">No reviews yet.</p>
        </ng-template>
      </div>

      <ng-template #noPlace>
        <p class="text-red-500 mt-6">
          Place not found or details could not be loaded.
        </p>
      </ng-template>

      <!-- Back link -->
      <div class="mt-8">
        <a
          routerLink="/places"
          class="text-blue-600 hover:underline"
          >← Back to Places</a
        >
      </div>

      <!-- Floating edit button (creator only) -->
      @if (isLoggedIn && hasCreatorRole) {
        <div class="fixed bottom-8 right-8">
          <a
            routerLink="/places/{{ placeId }}/edit"
            class="flex items-center justify-center w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700"
          >
            <span class="text-2xl">✏️</span>
          </a>
        </div>
      }
    </div>
  `,
  styles: []
})
export class PlaceDetailComponent implements OnInit {
  placeId: string | null = null;
  placeDTO: PlaceDto | null = null;

  constructor(
    private route: ActivatedRoute,
    private placeService: PlaceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.placeId = this.route.snapshot.paramMap.get('id');
    if (!this.placeId) return;

    this.placeService.getById(this.placeId).subscribe({
      next: place => (this.placeDTO = place),
      error: err => {
        console.error('Error fetching place details:', err);
        this.placeDTO = null;
      }
    });
  }

  /* Convenience getters for template */
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get hasCreatorRole(): boolean {
    return this.authService.hasRole('EVENT_CREATOR');
  }

  openGmaps(place: PlaceDto): void {
    if (place && place.address) {
      const address = encodeURIComponent(place.address);
      const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
      window.open(url, '_blank');
    }
  }
}
