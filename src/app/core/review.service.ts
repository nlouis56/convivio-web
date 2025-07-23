import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review, ReviewCreateRequest } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = '/api/reviews';

  constructor(private http: HttpClient) {}

  getReviewById(id: string): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/${id}`);
  }

  getReviewsByUser(userId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`/api/users/${userId}/reviews`);
  }

  getReviewsForPlace(placeId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`/api/places/${placeId}/reviews`);
  }

  getReviewsForEvent(eventId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`/api/events/${eventId}/reviews`);
  }

  createReviewForPlace(placeId: string, reviewData: ReviewCreateRequest): Observable<Review> {
    return this.http.post<Review>(`/api/places/${placeId}/reviews`, reviewData);
  }

  createReviewForEvent(eventId: string, reviewData: ReviewCreateRequest): Observable<Review> {
    return this.http.post<Review>(`/api/events/${eventId}/reviews`, reviewData);
  }

  updateReview(id: string, reviewData: ReviewCreateRequest): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}/${id}`, reviewData);
  }

  deleteReview(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
