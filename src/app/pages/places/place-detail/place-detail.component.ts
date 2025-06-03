import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-place-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-4">Place Details</h1>
      <p class="text-gray-600 mb-6">Place ID: {{ placeId }}</p>

      <div class="bg-white shadow-md rounded-lg p-6">
        <p>Place details will be implemented here.</p>
      </div>

      <div class="mt-6">
        <a routerLink="/places" class="text-blue-600 hover:underline">← Back to Places</a>
      </div>
    </div>
  `,
  styles: []
})
export class PlaceDetailComponent implements OnInit {
  placeId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.placeId = this.route.snapshot.paramMap.get('id');
  }
}
