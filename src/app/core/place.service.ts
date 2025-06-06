import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PlaceDto } from '../models/place.model';

@Injectable({ providedIn: 'root' })
export class PlaceService {
  private readonly baseUrl = `/api/places`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<PlaceDto[]> {
    return this.http.get<PlaceDto[]>(this.baseUrl);
  }

  getById(id: string): Observable<PlaceDto> {
    return this.http.get<PlaceDto>(`${this.baseUrl}/${id}`);
  }

  getByCategory(category: string): Observable<PlaceDto[]> {
    return this.http.get<PlaceDto[]>(`${this.baseUrl}/category/${category}`);
  }

  getNearBordeaux(distance = 10): Observable<PlaceDto[]> {
    const params = new HttpParams().set('distance', distance.toString());
    return this.http.get<PlaceDto[]>(`${this.baseUrl}/near/bordeaux`, { params });
  }

  getNearLocation(
    lng: number,
    lat: number,
    distance = 10
  ): Observable<PlaceDto[]> {
    const params = new HttpParams()
      .set('longitude', lng.toString())
      .set('latitude', lat.toString())
      .set('distance', distance.toString());
    return this.http.get<PlaceDto[]>(`${this.baseUrl}/near`, { params });
  }

  getPopular(limit = 10): Observable<PlaceDto[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<PlaceDto[]>(`${this.baseUrl}/popular`, { params });
  }

  getTopRated(limit = 10): Observable<PlaceDto[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<PlaceDto[]>(`${this.baseUrl}/top-rated`, { params });
  }

  getMostVisited(limit = 10): Observable<PlaceDto[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<PlaceDto[]>(`${this.baseUrl}/most-visited`, { params });
  }

  create(payload: PlaceDto): Observable<PlaceDto> {
    return this.http.post<PlaceDto>(this.baseUrl, payload);
  }

  update(id: string, payload: Partial<PlaceDto>): Observable<PlaceDto> {
    return this.http.put<PlaceDto>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
