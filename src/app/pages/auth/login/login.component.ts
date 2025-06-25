import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { TranslatePipe } from '../../../core/translate.pipe';
import { LanguageService } from '../../../core/language.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslatePipe],
  template: `
    <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-bold mb-6 text-center">{{ 'auth.login' | translate }}</h1>

      @if (errorMessage) {
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{{ errorMessage }}</p>
        </div>
      }

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label for="username" class="block text-gray-700 mb-2">{{ 'auth.username' | translate }}</label>
          <input
            type="text"
            id="username"
            formControlName="username"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            [class.border-red-500]="formSubmitted && loginForm.get('username')?.invalid"
          >
          @if (formSubmitted && loginForm.get('username')?.errors?.['required']) {
            <p class="text-red-500 text-sm mt-1">{{ 'validation.username-required' | translate }}</p>
          }
        </div>

        <div class="mb-6">
          <label for="password" class="block text-gray-700 mb-2">{{ 'auth.password' | translate }}</label>
          <input
            type="password"
            id="password"
            formControlName="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            [class.border-red-500]="formSubmitted && loginForm.get('password')?.invalid"
          >
          @if (formSubmitted && loginForm.get('password')?.errors?.['required']) {
            <p class="text-red-500 text-sm mt-1">{{ 'validation.password-required' | translate }}</p>
          }
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
          [disabled]="isLoading"
        >
          {{ isLoading ? ('auth.logging-in' | translate) : ('auth.login' | translate) }}
        </button>
      </form>

      <div class="mt-4 text-center">
        <p>{{ 'auth.dont-have-account' | translate }} <a routerLink="/register" class="text-blue-600 hover:underline">{{ 'auth.sign-up' | translate }}</a></p>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  loginForm: FormGroup;
  formSubmitted = false;
  errorMessage = '';
  isLoading = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private languageService: LanguageService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Get return URL from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(): void {
    this.formSubmitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 401) {
          this.errorMessage = this.languageService.translate('auth.invalid-credentials');
        } else {
          this.errorMessage = this.languageService.translate('auth.login-error');
        }
        console.error('Login error', error);
      }
    });
  }
}
