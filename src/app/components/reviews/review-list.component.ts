import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../core/review.service';
import { Review } from '../../models/review.model';
import { ReviewCreateComponent } from './review-create.component';
import { TranslatePipe } from '../../core/translate.pipe';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, ReviewCreateComponent, TranslatePipe],
  template: `
    <!-- Review Creation Form -->
    <div class="mb-6">
      <app-review-create
        [resourceType]="resourceType"
        [resourceId]="resourceId"
        [existingReviews]="reviews"
        (reviewCreated)="onReviewCreated($event)">
      </app-review-create>
    </div>

    <div class="bg-white shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-semibold mb-4">{{ 'misc.reviews' | translate }}</h2>
      
      <!-- Loading state -->
      <ng-container *ngIf="isLoading; else loadedContent">
        <div class="flex items-center justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-600"></div>
          <span class="ml-3 text-neutral/70">{{ 'info.loading' | translate }}</span>
        </div>
      </ng-container>

      <!-- Loaded content -->
      <ng-template #loadedContent>
        <ng-container *ngIf="reviews && reviews.length > 0; else noReviews">
          <div class="space-y-4">
            <div 
              *ngFor="let review of reviews" 
              class="border-b border-gray-200 pb-4 last:border-none last:pb-0"
            >
              <!-- Review header -->
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center">
                  <p class="font-medium text-neutral">
                    {{ review.user?.username || 'Anonymous' }}
                  </p>
                  <div class="flex items-center ml-3">
                    <div class="flex text-yellow-400">
                      <span *ngFor="let star of getStarArray(review.rating)" class="text-lg">★</span>
                      <span *ngFor="let star of getEmptyStarArray(review.rating)" class="text-gray-300 text-lg">★</span>
                    </div>
                    <span class="text-sm text-neutral/60 ml-2">
                      {{ review.rating }}/5
                    </span>
                  </div>
                </div>
                <span class="text-sm text-neutral/60">
                  {{ review.createdAt | date: 'short' }}
                </span>
              </div>
              
              <!-- Review comment -->
              <p class="text-neutral/80 leading-relaxed">
                {{ review.comment }}
              </p>
            </div>
          </div>
          
          <!-- Review stats -->
          <div class="mt-6 pt-4 border-t border-gray-200">
            <div class="flex items-center justify-between text-sm text-neutral/70">
              <span>{{ 'reviews.total-reviews' | translate }}: {{ reviews.length }}</span>
              <span *ngIf="averageRating > 0">
                {{ 'places.average-rating' | translate }}: {{ averageRating.toFixed(1) }}/5
              </span>
            </div>
          </div>
        </ng-container>

        <!-- No reviews state -->
        <ng-template #noReviews>
          <div class="text-center py-8">
            <p class="text-neutral/60 mb-2">{{ 'reviews.no-reviews' | translate }}</p>
            <p class="text-sm text-neutral/50">{{ 'reviews.be-first-to-review' | translate }}</p>
          </div>
        </ng-template>
      </ng-template>

      <!-- Error state -->
      <div *ngIf="hasError" class="text-center py-8">
        <p class="text-error mb-2">{{ 'reviews.error-loading-reviews' | translate }}</p>
        <button 
          (click)="loadReviews()"
          class="link text-sm"
        >
          {{ 'reviews.try-again' | translate }}
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class ReviewListComponent implements OnInit, OnChanges {
  @Input() resourceType: 'place' | 'event' = 'place';
  @Input() resourceId: string | null = null;

  reviews: Review[] = [];
  isLoading = false;
  hasError = false;
  averageRating = 0;

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resourceId'] || changes['resourceType']) {
      this.loadReviews();
    }
  }

  loadReviews(): void {
    if (!this.resourceId) {
      this.reviews = [];
      return;
    }

    this.isLoading = true;
    this.hasError = false;

    const reviews$ = this.resourceType === 'place' 
      ? this.reviewService.getReviewsForPlace(this.resourceId)
      : this.reviewService.getReviewsForEvent(this.resourceId);

    reviews$.subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.calculateAverageRating();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching reviews:', err);
        this.hasError = true;
        this.isLoading = false;
        this.reviews = [];
      }
    });
  }

  private calculateAverageRating(): void {
    if (this.reviews.length === 0) {
      this.averageRating = 0;
      return;
    }

    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = totalRating / this.reviews.length;
  }

  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStarArray(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  onReviewCreated(newReview: Review): void {
    // Add the new review to the beginning of the list
    this.reviews = [newReview, ...this.reviews];
    this.calculateAverageRating();
  }
}
