import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../core/review.service';
import { AuthService } from '../../core/auth.service';
import { Review, ReviewCreateRequest } from '../../models/review.model';
import { TranslatePipe } from '../../core/translate.pipe';

@Component({
  selector: 'app-review-create',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <!-- Only show if user is logged in and hasn't reviewed yet -->
    <div 
      *ngIf="shouldShowForm" 
      class="card border-l-4 border-primary-500 p-4"
    >
      <h3 class="text-xl font-semibold mb-4 text-neutral-800">
        {{ 'reviews.new' | translate }}
      </h3>

      <form (ngSubmit)="onSubmit()" #reviewForm="ngForm">
        <!-- Rating Selection -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            {{ 'reviews.rating' | translate }} *
          </label>
          <div class="flex items-center space-x-1">
            <button
              *ngFor="let star of [1,2,3,4,5]"
              type="button"
              (click)="setRating(star)"
              class="text-2xl transition-colors duration-200 focus:outline-none"
              [class.text-yellow-400]="star <= formData.rating"
              [class.text-neutral-300]="star > formData.rating"
              [class.hover:text-yellow-300]="star > formData.rating"
            >
              ★
            </button>
            <span class="ml-3 text-sm text-neutral-600" *ngIf="formData.rating > 0">
              {{ formData.rating }}/5
            </span>
          </div>
          <div *ngIf="submitted && formData.rating === 0" class="text-error text-sm mt-1">
            {{ 'reviews.rating-required' | translate }}
          </div>
        </div>

        <!-- Comment -->
        <div class="mb-4">
          <label for="comment" class="block text-sm font-medium text-neutral-700 mb-2">
            {{ 'reviews.comment' | translate }} *
          </label>
          <textarea
            id="comment"
            name="comment"
            [(ngModel)]="formData.comment"
            required
            rows="4"
            class="input resize-vertical"
            [placeholder]="'reviews.share-experience' | translate"
            #commentField="ngModel"
          ></textarea>
          <div *ngIf="submitted && commentField.invalid" class="text-error text-sm mt-1">
            {{ 'reviews.comment-required' | translate }}
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-between">
          <button
            type="submit"
            [disabled]="isSubmitting"
            class="btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span *ngIf="!isSubmitting">{{ 'reviews.submit' | translate }}</span>
            <span *ngIf="isSubmitting" class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
              {{ 'misc.submitting' | translate }}
            </span>
          </button>
          
          <button
            type="button"
            (click)="resetForm()"
            class="btn-ghost"
          >
            {{ 'reviews.cancel' | translate }}
          </button>
        </div>
      </form>

      <!-- Success Message -->
      <div 
        *ngIf="showSuccessMessage" 
        class="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md"
      >
        {{ 'reviews.review-submitted-successfully' | translate }}
      </div>

      <!-- Error Message -->
      <div 
        *ngIf="errorMessage" 
        class="mt-4 p-3 bg-danger-alert border border-accent-200 text-neutral-700 rounded-md"
      >
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: []
})
export class ReviewCreateComponent implements OnInit, OnChanges {
  @Input() resourceType: 'place' | 'event' = 'place';
  @Input() resourceId: string | null = null;
  @Input() existingReviews: Review[] = [];
  @Output() reviewCreated = new EventEmitter<Review>();

  formData: ReviewCreateRequest = {
    rating: 0,
    comment: ''
  };

  isSubmitting = false;
  submitted = false;
  showSuccessMessage = false;
  errorMessage = '';
  shouldShowForm = false;

  constructor(
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkShouldShowForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['existingReviews'] || changes['resourceId']) {
      this.checkShouldShowForm();
    }
  }

  private checkShouldShowForm(): void {
    // Only show if user is logged in and hasn't reviewed this resource yet
    const currentUser = this.authService.currentUserValue;
    
    if (!currentUser || !this.resourceId) {
      this.shouldShowForm = false;
      return;
    }

    // Check if user has already reviewed this resource
    const hasExistingReview = this.existingReviews.some(
      review => review.user?.id === currentUser.id
    );

    this.shouldShowForm = !hasExistingReview;
  }

  setRating(rating: number): void {
    this.formData.rating = rating;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    // Validate form
    if (this.formData.rating === 0 || !this.formData.comment.trim()) {
      return;
    }

    if (!this.resourceId) {
      this.errorMessage = 'Resource ID is required';
      return;
    }

    this.isSubmitting = true;

    const createReview$ = this.resourceType === 'place'
      ? this.reviewService.createReviewForPlace(this.resourceId, this.formData)
      : this.reviewService.createReviewForEvent(this.resourceId, this.formData);

    createReview$.subscribe({
      next: (review) => {
        this.showSuccessMessage = true;
        this.reviewCreated.emit(review);
        this.shouldShowForm = false; // Hide form after successful submission
        this.resetForm();
        this.isSubmitting = false;

        // Hide success message after 3 seconds
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
      },
      error: (err) => {
        console.error('Error creating review:', err);
        this.errorMessage = 'Failed to submit review. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  resetForm(): void {
    this.formData = {
      rating: 0,
      comment: ''
    };
    this.submitted = false;
    this.errorMessage = '';
    this.showSuccessMessage = false;
  }
}
