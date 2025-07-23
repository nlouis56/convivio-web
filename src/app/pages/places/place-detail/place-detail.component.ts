import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PlaceDto } from '../../../models/place.model';
import { PlaceService } from '../../../core/place.service';
import { AuthService } from '../../../core/auth.service';
import { MapDisplayComponent } from '../../../components/maps/map-display.component';
import { ReviewListComponent } from '../../../components/reviews/review-list.component';
import { TranslatePipe } from "../../../core/translate.pipe";


@Component({
  selector: 'app-place-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MapDisplayComponent,
    ReviewListComponent,
    TranslatePipe
],
  template: `
    <div class="max-w-5xl mx-auto">
      <!-- Heading -->
      <h1 class="text-3xl font-bold mb-2 text-neutral-800">{{'misc.details' | translate}}</h1>
      <p class="text-neutral-600 mb-6">Place ID: {{ placeId }}</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Details card -->
        <div class="card p-4">
          <ng-container *ngIf="placeDTO; else loading">
            <h2 class="text-2xl font-semibold mb-2 text-neutral-800">
              {{ placeDTO.name }}
            </h2>

            <p class="text-neutral-700 mb-4">
              {{ placeDTO.description }}
            </p>

            <div class="mb-4">
              <strong>{{'places.category' | translate}}: </strong> {{ placeDTO.category }}
            </div>

            <div class="mb-4">
              <strong>{{'places.address' | translate}}: </strong> {{ placeDTO.address }}
              <button
                class="ml-2 link"
                (click)="openGmaps(placeDTO)"
                *ngIf="placeDTO"
              >
                {{'places.view-on-gmaps' | translate}}
              </button>
            </div>

            <div class="mb-4">
              <strong>{{'places.average-rating' | translate}}: </strong>
              <span *ngIf="placeDTO.averageRating as avg">
                {{ avg.toFixed(1) }}
              </span>
              <span *ngIf="!placeDTO.averageRating">
                {{ 'places.not-rated' | translate }}
              </span>
            </div>

            <div class="mb-4">
              <strong>{{'places.photos' | translate}}</strong>
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
            <p class="text-neutral-500">{{'info.loading' | translate}}</p>
          </ng-template>
        </div>

        <!-- MapDisplay on the side -->
        <app-map-display
            [lat]="placeDTO?.location?.at(0) || 0"
            [lng]="placeDTO?.location?.at(1) || 0"
          ></app-map-display>
      </div>

      <!-- Reviews Section -->
      <div class="mt-8" *ngIf="placeDTO; else noPlace">
        <app-review-list 
          resourceType="place" 
          [resourceId]="placeId">
        </app-review-list>
      </div>

      <ng-template #noPlace>
        <p class="text-error mt-6">
          {{'misc.no-data' | translate}}
        </p>
      </ng-template>

      <!-- Back link -->
      <div class="mt-8">
        <a
          routerLink="/places"
          class="link"
          >← {{'places.back-to' | translate}}</a
        >
      </div>

      <!-- Floating edit button (creator only) -->
      @if (isLoggedIn && hasCreatorRole) {
        <div class="fixed bottom-8 right-8">
          <a
            routerLink="/places/{{ placeId }}/edit"
            class="flex items-center justify-center w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors"
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
