import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, EventCreateRequest, EventUpdateRequest } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = '/api/events';

  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<Event[]> {
    const res = this.http.get<Event[]>(this.apiUrl);
    res.subscribe({
      next: (events) => { return events; },
      error: (error) => { console.error('Error fetching events:', error); },
      complete: () => {/*success*/ }
    });
    return res;
  }

  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  getUpcomingEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/upcoming`);
  }

  getPastEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/past`);
  }

  getOngoingEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/ongoing`);
  }

  getEventsByDateRange(startDate: string, endDate: string): Observable<Event[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<Event[]>(`${this.apiUrl}/date-range`, { params });
  }

  getEventsByPlace(placeId: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/place/${placeId}`);
  }

  getEventsByCreator(creatorId: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/creator/${creatorId}`);
  }

  getEventsByParticipant(participantId: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/participant/${participantId}`);
  }

  getEventsWithAvailableSlots(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/available`);
  }

  getPopularEvents(limit: number = 10): Observable<Event[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Event[]>(`${this.apiUrl}/popular`, { params });
  }

  createEvent(eventData: EventCreateRequest, placeId: string, groupId?: string): Observable<Event> {
    let params = new HttpParams().set('placeId', placeId);
    if (groupId) {
      params = params.set('groupId', groupId);
    }
    return this.http.post<Event>(this.apiUrl, eventData, { params });
  }

  updateEvent(eventData: Partial<EventUpdateRequest>, placeId: string): Observable<EventUpdateRequest> {
    let params = new HttpParams().set('placeId', placeId);
    return this.http.put<EventUpdateRequest>(`${this.apiUrl}/${eventData.id}`, eventData, { params });
  }

  publishEvent(id: string): Observable<Event> {
    return this.http.patch<Event>(`${this.apiUrl}/${id}/publish`, {});
  }

  unpublishEvent(id: string): Observable<Event> {
    return this.http.patch<Event>(`${this.apiUrl}/${id}/unpublish`, {});
  }

  joinEvent(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/participants`, {});
  }

  leaveEvent(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}/participants`);
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
