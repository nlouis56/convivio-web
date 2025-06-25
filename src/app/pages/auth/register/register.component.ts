import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { TranslatePipe } from '../../../core/translate.pipe';
import { LanguageService } from '../../../core/language.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslatePipe],
  template: `
    <div class="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-bold mb-6 text-center">{{ 'auth.register' | translate }}</h1>

      @if (errorMessage) {
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{{ errorMessage }}</p>
        </div>
      }

      @if (success) {
        <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
          <p>{{ 'auth.register-success' | translate }} <a routerLink="/login" class="underline">{{ 'auth.log-in-link' | translate }}</a> {{ 'auth.to-continue' | translate }}.</p>
        </div>
      }

      <form *ngIf="!success" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label for="username" class="block text-gray-700 mb-2">{{ 'auth.username' | translate }}</label>
          <input
            type="text"
            id="username"
            formControlName="username"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            [class.border-red-500]="formSubmitted && registerForm.get('username')?.invalid"
          >
          @if (formSubmitted && registerForm.get('username')?.errors?.['required']) {
            <p class="text-red-500 text-sm mt-1">{{ 'validation.username-required' | translate }}</p>
          }
        </div>

        <div class="mb-4">
          <label for="email" class="block text-gray-700 mb-2">{{ 'auth.email' | translate }}</label>
          <input
            type="email"
            id="email"
            formControlName="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            [class.border-red-500]="formSubmitted && registerForm.get('email')?.invalid"
          >
          @if (formSubmitted && registerForm.get('email')?.errors?.['required']) {
            <p class="text-red-500 text-sm mt-1">{{ 'validation.email-required' | translate }}</p>
          }
          @if (formSubmitted && registerForm.get('email')?.errors?.['email']) {
            <p class="text-red-500 text-sm mt-1">{{ 'validation.email' | translate }}</p>
          }
        </div>

        <div class="mb-4">
          <label for="password" class="block text-gray-700 mb-2">{{ 'auth.password' | translate }}</label>
          <input
            type="password"
            id="password"
            formControlName="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            [class.border-red-500]="formSubmitted && registerForm.get('password')?.invalid"
          >
          @if (formSubmitted && registerForm.get('password')?.errors?.['required']) {
            <p class="text-red-500 text-sm mt-1">{{ 'validation.password-required' | translate }}</p>
          }
          @if (formSubmitted && registerForm.get('password')?.errors?.['minlength']) {
            <p class="text-red-500 text-sm mt-1">{{ 'validation.password-min' | translate }}</p>
          }
        </div>

        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label for="firstName" class="block text-gray-700 mb-2">{{ 'auth.first-name' | translate }}</label>
            <input
              type="text"
              id="firstName"
              formControlName="firstName"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
          </div>
          <div>
            <label for="lastName" class="block text-gray-700 mb-2">{{ 'auth.last-name' | translate }}</label>
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
          [disabled]="isLoading"
        >
          {{ isLoading ? ('auth.creating-account' | translate) : ('auth.register' | translate) }}
        </button>
      </form>

      <div class="mt-4 text-center">
        <p>{{ 'auth.already-have-account' | translate }} <a routerLink="/login" class="text-blue-600 hover:underline">{{ 'auth.log-in-link' | translate }}</a></p>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  registerForm: FormGroup;
  formSubmitted = false;
  errorMessage = '';
  isLoading = false;
  success = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private languageService: LanguageService
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: [''],
      lastName: ['']
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.success = true;
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 400 && error.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = this.languageService.translate('auth.register-error');
        }
        console.error('Registration error', error);
      }
    });
  }
}
