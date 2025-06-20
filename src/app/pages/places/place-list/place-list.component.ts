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
        [disabled]="isLoading"
        class="px-4 py-2 rounded-full transition"
        [class.cursor-not-allowed]="isLoading"
        [class.opacity-50]="isLoading"
        [class.bg-green-600]="currentFilter === filter.value"
        [class.text-white]="currentFilter === filter.value"
        [class.bg-gray-200]="currentFilter !== filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- Loading indicator -->
    <div *ngIf="isLoading" class="flex justify-center items-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600"></div>
      <span class="ml-4 text-gray-600">Loading places...</span>
    </div>

    <!-- Once loading is done, show either the grid or "no places" -->
    <ng-container *ngIf="!isLoading; else loadingTpl">
      <div *ngIf="places.length > 0; else noPlacesTpl"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ng-container *ngFor="let place of places; trackBy: trackById">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <ng-container *ngIf="place.photoUrls.length; else noImageTpl">
              <img [src]="place.photoUrls[0]"
                    [alt]="place.name"
                    class="w-full h-48 object-cover">
            </ng-container>
            <ng-template #noImageTpl>
              <div class="w-full h-48 bg-gray-300 flex items-center justify-center">
                <span class="text-gray-500">No image</span>
              </div>
            </ng-template>

            <div class="p-4">
              <h3 class="text-xl font-semibold mb-2">{{ place.name }}</h3>
              <div class="flex items-center mb-2">
                <span class="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded">
                  {{ place.category }}
                </span>
                <div *ngIf="place.averageRating" class="ml-auto flex items-center">
                  <span class="text-yellow-500">★</span>
                  <span class="ml-1">{{ place.averageRating.toFixed(1) }}</span>
                </div>
              </div>
              <p class="text-gray-600 mb-2">{{ place.address }}</p>
              <p class="mb-4">
                {{ place.description | slice:0:100 }}
                {{ place.description.length > 100 ? '…' : '' }}
              </p>
              <div class="flex justify-between items-center mt-4">
                <button [routerLink]="['/places', place.id]"
                        class="px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  View details
                </button>
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    </ng-container>

    <!-- Templates -->
    <ng-template #loadingTpl></ng-template>

    <ng-template #noPlacesTpl>
      <div class="col-span-full text-center py-10">
        <p class="text-gray-500 mb-4">No places found</p>
        <button *ngIf="isLoggedIn && hasCreatorRole"
                [routerLink]="['/places/create']"
                class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Add a Place
        </button>
      </div>
    </ng-template>

    <ng-container *ngIf="isLoggedIn && hasCreatorRole">
      <div class="fixed bottom-8 right-8">
        <button [routerLink]="['/places/create']"
                class="flex items-center justify-center w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors">
          <span class="text-2xl">+</span>
        </button>
      </div>
    </ng-container>
  `,
  styles: []
})
export class PlaceListComponent implements OnInit {
  places: PlaceDto[] = [];
  isLoading = false;
  currentFilter = 'all';
  filters = [
    { label: 'All Places', value: 'all', access: '' },
    { label: 'Top Rated', value: 'top-rated', access: '' },
    { label: 'Popular', value: 'popular', access: '' },
    { label: 'Most Visited', value: 'most-visited', access: '' },
    { label: 'Deactivated', value: 'deactivated', access: 'ADMIN' }
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
    if (this.currentFilter === filter || this.isLoading) {
      return;
    }
    this.currentFilter = filter;
    this.loadPlaces();
  }

  loadPlaces(): void {
    this.isLoading = true;
    let request$ = this.placeService.getAll(); // extend switch later for other filters

    request$.subscribe({
      next: places => {
        this.places = places;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error loading places', err);
        this.isLoading = false;
      }
    });
  }

  trackById(_: number, place: PlaceDto) {
    return place.id;
  }
}
