import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-4">Event Details</h1>
      <p class="text-gray-600 mb-6">Event ID: {{ eventId }}</p>

      <div class="bg-white shadow-md rounded-lg p-6">
        <p>Event details will be implemented here.</p>
      </div>

      <div class="mt-6">
        <a routerLink="/events" class="text-blue-600 hover:underline">← Back to Events</a>
      </div>
    </div>
  `,
  styles: []
})
export class EventDetailComponent implements OnInit {
  eventId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
  }
}
