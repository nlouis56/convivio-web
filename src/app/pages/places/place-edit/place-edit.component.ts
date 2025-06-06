import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PlaceDto } from '../../../models/place.model';
import { PlaceService } from '../../../core/place.service';

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
          <!-- Left: Update & Delete buttons -->
          <div class="flex gap-2">
            <button
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              [disabled]="!placeForm.valid"
            >
              Update Place
            </button>
            <button
              class="bg-gray-300 hover:bg-red-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              (click)="onDelete()"
            >
              Delete place
            </button>
          </div>
          <!-- Right: Validity checks & Cancel -->
          <div class="flex flex-col items-end gap-1">
            <span class="text-red-500" *ngIf="placeForm.invalid && placeForm.touched">
              Please fill out all required fields correctly.
            </span>
            <span class="text-green-500" *ngIf="placeForm.valid && placeForm.touched">
              Form is valid!
            </span>
            <span class="text-gray-500" *ngIf="placeForm.pristine">
              No changes made yet.
            </span>
            <a [routerLink]="['/places', placeId]" class="text-blue-500 hover:underline">Cancel</a>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class PlaceEditComponent {
  placeForm: FormGroup;
  placeId: string | null = null;
  placeData: PlaceDto | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private placeService: PlaceService
  ) {
    this.placeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      address: ['', Validators.required]
    });
  }

  onDelete(): void {
    this.placeService.delete(this.placeId!).subscribe({
      next: () => {
        console.log('Place deleted successfully');
        alert('Place deleted successfully!');
      }
      , error: (err) => {
        console.error('Error deleting place:', err);
        alert('Failed to delete place. Please try again later.');
      }
    });
  }

  ngOnInit(): void {
    this.placeId = this.route.snapshot.paramMap.get('id');

    this.placeService.getById(this.placeId!).subscribe({
      next: (place: PlaceDto) => {
        this.placeData = place;
        this.populateForm();
      },
      error: (err) => {
        console.error('Error fetching place data:', err);
        this.placeData = null;
        this.placeForm.reset();
        alert('Failed to load place data. Please try again later.');
      }
    });
  }

  private populateForm(): void {
    if (!this.placeData) return;
    this.placeForm.patchValue({
      name: this.placeData.name,
      description: this.placeData.description,
      address: this.placeData.address
    });
  }

  onSubmit(): void {
    if (this.placeForm.valid) {
      console.log('Form submitted:', this.placeForm.value);
      const updatedPlace: PlaceDto = {
        ...this.placeData,
        ...this.placeForm.value
      };
      this.placeService.update(this.placeId!, updatedPlace).subscribe({
        next: () => {
          console.log('Place updated successfully');
          alert('Place updated successfully!');
        },
        error: (err) => {
          console.error('Error updating place:', err);
          alert('Failed to update place. Please try again later.');
        }
      });
    }
  }
}
