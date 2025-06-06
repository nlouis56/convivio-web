import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PlaceService } from '../../../core/place.service';
import { PlaceDto } from '../../../models/place.model';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-place-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Places</h1>
      <p class="text-gray-600">Discover great locations around you</p>
    </div>

    <div class="mb-8 flex flex-wrap gap-4">
      <button
        *ngFor="let filter of filters"
        (click)="applyFilter(filter.value)"
        class="px-4 py-2 rounded-full"
        [class.bg-green-600]="currentFilter === filter.value"
        [class.text-white]="currentFilter === filter.value"
        [class.bg-gray-200]="currentFilter !== filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      @if (places.length > 0) {
        @for (place of places; track place.id) {
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            @if (place.photoUrls.length > 0) {
              <img [src]="place.photoUrls[0]" alt="{{ place.name }}" class="w-full h-48 object-cover">
            } @else {
              <div class="w-full h-48 bg-gray-300 flex items-center justify-center">
                <span class="text-gray-500">No image</span>
              </div>
            }

            <div class="p-4">
              <h3 class="text-xl font-semibold mb-2">{{ place.name }}</h3>
              <div class="flex items-center mb-2">
                <span class="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded">{{ place.category }}</span>
                @if (place.averageRating) {
                  <div class="ml-auto flex items-center">
                    <span class="text-yellow-500">★</span>
                    <span class="ml-1">{{ place.averageRating.toFixed(1) }}</span>
                  </div>
                }
              </div>
              <p class="text-gray-600 mb-2">{{ place.address }}</p>
              <p class="mb-4">{{ place.description | slice:0:100 }}{{ place.description.length > 100 ? '...' : '' }}</p>

              <div class="flex justify-between items-center mt-4">
                <a [routerLink]="['/places', place.id]" class="text-green-600 hover:underline">View details</a>
              </div>
            </div>
          </div>
        }
      } @else {
        <div class="col-span-full text-center py-10">
          <p class="text-gray-500 mb-4">No places found</p>
          @if (isLoggedIn && hasCreatorRole) {
            <a
              routerLink="/places/create"
              class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add a Place
            </a>
          }
        </div>
      }
    </div>

    @if (isLoggedIn && hasCreatorRole) {
      <div class="fixed bottom-8 right-8">
        <a
          routerLink="/places/create"
          class="flex items-center justify-center w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700"
        >
          <span class="text-2xl">+</span>
        </a>
      </div>
    }
  `,
  styles: []
})
export class PlaceListComponent implements OnInit {
  places: PlaceDto[] = [];
  isLoading = false;
  currentFilter = 'all';
  filters = [
    { label: 'All Places', value: 'all', access: "" },
    { label: 'Top Rated', value: 'top-rated', access: ""  },
    { label: 'Popular', value: 'popular', access: ""  },
    { label: 'Most Visited', value: 'most-visited', access: ""  },
    { label: 'Deactivated', value: 'deactivated', access: "ADMIN"  }
  ];

  constructor(
    private placeService: PlaceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPlaces();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get hasCreatorRole(): boolean {
    return this.authService.hasRole('EVENT_CREATOR');
  }

  get hasAdminRole(): boolean {
    return this.authService.hasRole('ADMIN');
  }

  applyFilter(filter: string): void {
    this.currentFilter = filter;
    this.loadPlaces();
  }

  loadPlaces(): void {
    this.isLoading = true;
    let request;

    switch (this.currentFilter) {
      default:
        request = this.placeService.getAll();
    }

    request.subscribe({
      next: (places) => {
        this.places = places;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading places', error);
        this.isLoading = false;
      }
    });
  }
}
