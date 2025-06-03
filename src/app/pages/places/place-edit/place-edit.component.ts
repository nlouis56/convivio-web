import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-place-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Edit Place</h1>

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
            Update Place
          </button>
          <a [routerLink]="['/places', placeId]" class="text-blue-500 hover:underline">Cancel</a>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class PlaceEditComponent implements OnInit {
  placeForm: FormGroup;
  placeId: string | null = null;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    this.placeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.placeId = this.route.snapshot.paramMap.get('id');
    // Here you would fetch the place data and patch form
    this.placeForm.patchValue({
      name: 'Sample Place Name',
      description: 'This is a sample place description for editing purposes.',
      address: '123 Sample Street, City, Country'
    });
  }

  onSubmit(): void {
    if (this.placeForm.valid) {
      console.log('Form submitted:', this.placeForm.value);
      // Update service call would go here
    }
  }
}
