import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/user.service';
import { AuthService } from '../../core/auth.service';
import { EventService } from '../../core/event.service';
import { User } from '../../models/user.model';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h1 class="text-3xl font-bold mb-6">Your Profile</h1>

      @if (isLoading) {
        <div class="text-center py-8">
          <p>Loading profile...</p>
        </div>
      } @else if (user) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div class="mb-6">
              <h2 class="text-xl font-semibold mb-4">Profile Information</h2>

              @if (errorMessage) {
                <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                  <p>{{ errorMessage }}</p>
                </div>
              }

              @if (successMessage) {
                <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
                  <p>{{ successMessage }}</p>
                </div>
              }

              <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
                <div class="mb-4">
                  <label for="username" class="block text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    id="username"
                    formControlName="username"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    [class.border-red-500]="profileForm.get('username')?.invalid && (profileForm.get('username')?.dirty || profileForm.get('username')?.touched)"
                  >
                  @if (profileForm.get('username')?.invalid && (profileForm.get('username')?.dirty || profileForm.get('username')?.touched)) {
                    <p class="text-red-500 text-sm mt-1">Username is required</p>
                  }
                </div>

                <div class="mb-4">
                  <label for="email" class="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    formControlName="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    [class.border-red-500]="profileForm.get('email')?.invalid && (profileForm.get('email')?.dirty || profileForm.get('email')?.touched)"
                  >
                  @if (profileForm.get('email')?.invalid && (profileForm.get('email')?.dirty || profileForm.get('email')?.touched)) {
                    <p class="text-red-500 text-sm mt-1">Valid email is required</p>
                  }
                </div>

                <div class="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label for="firstName" class="block text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      formControlName="firstName"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                  </div>
                  <div>
                    <label for="lastName" class="block text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      formControlName="lastName"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                  </div>
                </div>

                <button
                  type="submit"
                  class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                  [disabled]="profileForm.invalid || isSubmitting"
                >
                  {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
                </button>
              </form>
            </div>

            <div>
              <h2 class="text-xl font-semibold mb-4">Account Information</h2>
              <div class="bg-gray-100 p-4 rounded-lg">
                <p class="mb-2"><strong>User ID:</strong> {{ user.id }}</p>
                <p class="mb-2"><strong>Roles:</strong> {{ user.roles?.join(', ') }}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 class="text-xl font-semibold mb-4">Your Events</h2>

            <div class="space-y-4">
              @if (userEvents.length > 0) {
                @for (event of userEvents; track event.id) {
                  <div class="border border-gray-200 rounded-lg p-4">
                    <h3 class="text-lg font-medium mb-2">{{ event.title }}</h3>
                    <p class="text-gray-600 mb-2">{{ formatDate(event.startDateTime) }}</p>
                    <div class="flex justify-between mt-3">
                      <a [routerLink]="['/events', event.id]" class="text-blue-600 hover:underline">View details</a>
                      <button
                        (click)="leaveEvent(event.id)"
                        class="text-red-600 hover:underline"
                      >
                        Leave event
                      </button>
                    </div>
                  </div>
                }
              } @else {
                <p class="text-gray-500">You haven't joined any events yet.</p>
                <a routerLink="/events" class="text-blue-600 hover:underline block mt-4">Browse events</a>
              }
            </div>

            @if (hasCreatorRole) {
              <h2 class="text-xl font-semibold mb-4 mt-8">Events You Created</h2>
              <div class="space-y-4">
                @if (createdEvents.length > 0) {
                  @for (event of createdEvents; track event.id) {
                    <div class="border border-gray-200 rounded-lg p-4">
                      <h3 class="text-lg font-medium mb-2">{{ event.title }}</h3>
                      <p class="text-gray-600 mb-1">{{ formatDate(event.startDateTime) }}</p>
                      <p class="text-sm text-gray-500">{{ event.participantCount || 0 }}/{{ event.maxParticipants }} participants</p>
                      <div class="flex justify-between mt-3">
                        <a [routerLink]="['/events', event.id]" class="text-blue-600 hover:underline">View details</a>
                        <a [routerLink]="['/events', event.id, 'edit']" class="text-green-600 hover:underline">Edit</a>
                      </div>
                    </div>
                  }
                } @else {
                  <p class="text-gray-500">You haven't created any events yet.</p>
                  <a routerLink="/events/create" class="text-blue-600 hover:underline block mt-4">Create an event</a>
                }
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="text-center py-8">
          <p class="text-red-500">Could not load profile. Please try again later.</p>
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
