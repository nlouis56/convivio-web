import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-place-create',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Create New Place</h1>

      <form [formGroup]="placeForm" (ngSubmit)="onSubmit()" class="bg-white shadow-md rounded-lg p-6">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
            Place Name
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            formControlName="name"
            placeholder="Enter place name"
          >
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
            Description
          </label>
          <textarea
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            formControlName="description"
            placeholder="Place description"
            rows="4"
          ></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="address">
            Address
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="address"
            type="text"
            formControlName="address"
            placeholder="Enter place address"
          >
        </div>

        <div class="flex items-center justify-between">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            [disabled]="!placeForm.valid"
          >
            Create Place
          </button>
          <a routerLink="/places" class="text-blue-500 hover:underline">Cancel</a>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class PlaceCreateComponent {
  placeForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.placeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      address: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.placeForm.valid) {
      console.log('Form submitted:', this.placeForm.value);
      // Submit to service would go here
    }
  }
}
