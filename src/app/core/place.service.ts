import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Place, PlaceCreateRequest } from '../models/place.model';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  private apiUrl = '/api/places';

  constructor(private http: HttpClient) {}

  getAllPlaces(): Observable<Place[]> {
    return this.http.get<Place[]>(this.apiUrl);
  }

  getPlaceById(id: string): Observable<Place> {
    return this.http.get<Place>(`${this.apiUrl}/${id}`);
  }

  getPlacesByCategory(category: string): Observable<Place[]> {
    return this.http.get<Place[]>(`${this.apiUrl}/category/${category}`);
  }

  getPlacesNearBordeaux(distance: number = 10.0): Observable<Place[]> {
    const params = new HttpParams().set('distance', distance.toString());
    return this.http.get<Place[]>(`${this.apiUrl}/near/bordeaux`, { params });
  }

  getPlacesNearLocation(longitude: number, latitude: number, distance: number = 10.0): Observable<Place[]> {
    const params = new HttpParams()
      .set('longitude', longitude.toString())
      .set('latitude', latitude.toString())
      .set('distance', distance.toString());
    return this.http.get<Place[]>(`${this.apiUrl}/near`, { params });
  }

  getPopularPlaces(limit: number = 10): Observable<Place[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Place[]>(`${this.apiUrl}/popular`, { params });
  }

  getTopRatedPlaces(limit: number = 10): Observable<Place[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Place[]>(`${this.apiUrl}/top-rated`, { params });
  }

  getMostVisitedPlaces(limit: number = 10): Observable<Place[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Place[]>(`${this.apiUrl}/most-visited`, { params });
  }

  createPlace(placeData: PlaceCreateRequest): Observable<Place> {
    return this.http.post<Place>(this.apiUrl, placeData);
  }

  updatePlace(id: string, placeData: Partial<PlaceCreateRequest>): Observable<Place> {
    return this.http.put<Place>(`${this.apiUrl}/${id}`, placeData);
  }

  deletePlace(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 
