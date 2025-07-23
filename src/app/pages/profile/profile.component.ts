import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/user.service';
import { AuthService } from '../../core/auth.service';
import { EventService } from '../../core/event.service';
import { User } from '../../models/user.model';
import { Event } from '../../models/event.model';
import { TranslatePipe } from '../../core/translate.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TranslatePipe],
  template: `
    <div class="card p-6 mb-8">
      <h1 class="text-3xl font-bold mb-6 text-neutral">{{ 'profile.title' | translate }}</h1>

      @if (isLoading) {
        <div class="text-center py-8">
          <p class="text-neutral/70">{{ 'profile.loading' | translate }}</p>
        </div>
      } @else if (user) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div class="mb-6">
              <h2 class="text-xl font-semibold mb-4 text-neutral">{{ 'profile.info' | translate }}</h2>

              @if (errorMessage) {
                <div class="bg-danger-alert mb-6" role="alert">
                  <p>{{ errorMessage }}</p>
                </div>
              }

              @if (successMessage) {
                <div class="bg-primary-50 border-l-4 border-primary-500 text-primary-700 p-4 mb-6" role="alert">
                  <p>{{ successMessage }}</p>
                </div>
              }

              <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
                <div class="mb-4">
                  <label for="username" class="block text-neutral mb-2 font-medium">{{ 'auth.username' | translate }}</label>
                  <input
                    type="text"
                    id="username"
                    formControlName="username"
                    class="input"
                    [class.input-error]="profileForm.get('username')?.invalid && (profileForm.get('username')?.dirty || profileForm.get('username')?.touched)"
                  >
                  @if (profileForm.get('username')?.invalid && (profileForm.get('username')?.dirty || profileForm.get('username')?.touched)) {
                    <p class="text-error text-sm mt-1">{{ 'validation.username-required' | translate }}</p>
                  }
                </div>

                <div class="mb-4">
                  <label for="email" class="block text-neutral mb-2 font-medium">{{ 'auth.email' | translate }}</label>
                  <input
                    type="email"
                    id="email"
                    formControlName="email"
                    class="input"
                    [class.input-error]="profileForm.get('email')?.invalid && (profileForm.get('email')?.dirty || profileForm.get('email')?.touched)"
                  >
                  @if (profileForm.get('email')?.invalid && (profileForm.get('email')?.dirty || profileForm.get('email')?.touched)) {
                    <p class="text-error text-sm mt-1">{{ 'validation.email' | translate }}</p>
                  }
                </div>

                <div class="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label for="firstName" class="block text-neutral mb-2 font-medium">{{ 'auth.first-name' | translate }}</label>
                    <input
                      type="text"
                      id="firstName"
                      formControlName="firstName"
                      class="input"
                    >
                  </div>
                  <div>
                    <label for="lastName" class="block text-neutral mb-2 font-medium">{{ 'auth.last-name' | translate }}</label>
                    <input
                      type="text"
                      id="lastName"
                      formControlName="lastName"
                      class="input"
                    >
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn"
                  [disabled]="profileForm.invalid || isSubmitting"
                >
                  {{ isSubmitting ? ('profile.saving' | translate) : ('profile.save-changes' | translate) }}
                </button>
              </form>
            </div>

            <div>
              <h2 class="text-xl font-semibold mb-4 text-neutral">{{ 'profile.account-info' | translate }}</h2>
              <div class="bg-surface p-4 rounded-lg border border-gray-200">
                <p class="mb-2 text-neutral"><strong>{{ 'profile.user-id' | translate }}:</strong> {{ user.id }}</p>
                <p class="mb-2 text-neutral"><strong>{{ 'profile.roles' | translate }}:</strong> {{ user.roles?.join(', ') }}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 class="text-xl font-semibold mb-4 text-neutral">{{ 'profile.your-events' | translate }}</h2>

            <div class="space-y-4">
              @if (userEvents.length > 0) {
                @for (event of userEvents; track event.id) {
                  <div class="card p-4">
                    <h3 class="text-lg font-medium mb-2 text-neutral">{{ event.title }}</h3>
                    <p class="text-neutral/70 mb-2">{{ formatDate(event.startDateTime) }}</p>
                    <div class="flex justify-between mt-3">
                      <a [routerLink]="['/events', event.id]" class="link">{{ 'profile.view-details' | translate }}</a>
                      <button
                        (click)="leaveEvent(event.id)"
                        class="text-accent-600 hover:text-accent-700 transition-colors"
                      >
                        {{ 'profile.leave-event' | translate }}
                      </button>
                    </div>
                  </div>
                }
              } @else {
                <p class="text-neutral/60">{{ 'profile.no-events' | translate }}</p>
                <a routerLink="/events" class="link block mt-4">{{ 'profile.browse-events' | translate }}</a>
              }
            </div>

            @if (hasCreatorRole) {
              <h2 class="text-xl font-semibold mb-4 mt-8 text-neutral">{{ 'profile.created-events' | translate }}</h2>
              <div class="space-y-4">
                @if (createdEvents.length > 0) {
                  @for (event of createdEvents; track event.id) {
                    <div class="card p-4">
                      <h3 class="text-lg font-medium mb-2 text-neutral">{{ event.title }}</h3>
                      <p class="text-neutral/70 mb-1">{{ formatDate(event.startDateTime) }}</p>
                      <p class="text-sm text-neutral/60">{{ event.participantCount || 0 }}/{{ event.maxParticipants }} {{ 'form.participants' | translate }}</p>
                      <div class="flex justify-between mt-3">
                        <a [routerLink]="['/events', event.id]" class="link">{{ 'profile.view-details' | translate }}</a>
                        <a [routerLink]="['/events', event.id, 'edit']" class="text-primary-600 hover:text-primary-700 transition-colors">{{ 'profile.edit' | translate }}</a>
                      </div>
                    </div>
                  }
                } @else {
                  <p class="text-neutral/60">{{ 'profile.no-created-events' | translate }}</p>
                  <a routerLink="/events/create" class="link block mt-4">{{ 'profile.create-event' | translate }}</a>
                }
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="text-center py-8">
          <p class="text-error">{{ 'profile.could-not-load' | translate }}</p>
        </div>
      }
    </div>
  `,
  styles: []
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  userEvents: Event[] = [];
  createdEvents: Event[] = [];
  profileForm: FormGroup;
  isLoading = true;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private eventService: EventService
  ) {
    this.profileForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadUserEvents();
    if (this.hasCreatorRole) {
      this.loadCreatedEvents();
    }
  }

  get hasCreatorRole(): boolean {
    return this.authService.hasRole('EVENT_CREATOR');
  }

  loadUserProfile(): void {
    const userId = this.authService.currentUserValue?.id;
    if (!userId) {
      this.isLoading = false;
      this.errorMessage = 'User not found';
      return;
    }

    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.user = user;
        this.isLoading = false;
        // Set form values
        this.profileForm.patchValue({
          username: user.username,
          email: user.email,
          firstName: user.firstName || '',
          lastName: user.lastName || ''
        });
      },
      error: (error) => {
        console.error('Error loading user profile', error);
        this.isLoading = false;
        this.errorMessage = 'Failed to load profile data';
      }
    });
  }

  loadUserEvents(): void {
    const userId = this.authService.currentUserValue?.id;
    if (!userId) return;

    this.eventService.getEventsByParticipant(userId).subscribe({
      next: (events) => {
        this.userEvents = events;
      },
      error: (error) => {
        console.error('Error loading user events', error);
      }
    });
  }

  loadCreatedEvents(): void {
    const userId = this.authService.currentUserValue?.id;
    if (!userId) return;

    this.eventService.getEventsByCreator(userId).subscribe({
      next: (events) => {
        this.createdEvents = events;
      },
      error: (error) => {
        console.error('Error loading created events', error);
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const userId = this.authService.currentUserValue?.id;
    if (!userId) {
      this.isSubmitting = false;
      this.errorMessage = 'User not found';
      return;
    }

    this.userService.updateUser(userId, this.profileForm.value).subscribe({
      next: (user) => {
        this.isSubmitting = false;
        this.user = user;
        this.successMessage = 'Profile updated successfully';
      },
      error: (error) => {
        this.isSubmitting = false;
        if (error.status === 400 && error.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'An error occurred while updating your profile';
        }
        console.error('Profile update error', error);
      }
    });
  }

  leaveEvent(eventId: string): void {
    this.eventService.leaveEvent(eventId).subscribe({
      next: () => {
        // Remove event from list
        this.userEvents = this.userEvents.filter(event => event.id !== eventId);
      },
      error: (error) => {
        console.error('Error leaving event', error);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
