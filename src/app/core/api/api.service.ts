import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '@app/../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

const apiUrl: string = environment.apiUrl;
// const apiUrl = 'http://localhost:8080';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  withCredentials: true,
};

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private eventIdSource = new BehaviorSubject(1); // Default to event ID 1
  currentEventId$ = this.eventIdSource.asObservable();

  private eventSource = new BehaviorSubject(null);
  currentEvent$ = this.eventSource.asObservable();

  constructor(private httpClient: HttpClient) { }

  changeEventId(newEventId: number) {
    this.eventIdSource.next(newEventId);
  }

  changeEvent(newEvent: any) {
    this.eventSource.next(newEvent);
  }

  public createCurlingEvent(
    name,
    eventType,
    info,
    completed,
    beginDate,
    endDate
  ) {
    const body = {
      name: name,
      eventType: eventType,
      info: info,
      completed: completed,
      beginDate: beginDate,
      endDate: endDate,
    };
    return this.httpClient.post(`${apiUrl}/api/v1/create-curling-event`, body);
  }

  /********************************************************************/

  public adHocQuery(query) {
    const body = {
      sql: query,
    };
    return this.httpClient.post(`${apiUrl}/api/v1/DANGEROUSADHOC`, body);
  }

  /********************************************************************/

  public getEvents() {
    return this.httpClient.get(`${apiUrl}/api/v1/events`);
  }

  public getTeams(eventId) {
    return this.httpClient.get(`${apiUrl}/api/v1/events/${eventId}/teams`);
  }

  public getGames(eventId) {
    return this.httpClient.get(`${apiUrl}/api/v1/events/${eventId}/games`);
  }

  public getDraws(eventId) {
    return this.httpClient.get(`${apiUrl}/api/v1/events/${eventId}/draws`);
  }

  public getGamesByTeam(eventId, teamId) {
    return this.httpClient.get(
      `${apiUrl}/api/v1/events/${eventId}/teams/${teamId}/games`
    );
  }

  public getScoresByTeam(eventId, teamId) {
    return this.httpClient.get(
      `${apiUrl}/api/v1/events/${eventId}/teams/${teamId}/scores`
    );
  }

  public getScoresByEvent(eventId) {
    return this.httpClient.get(`${apiUrl}/api/v1/events/${eventId}/scores`);
  }

  /********************************************************************/

  public addDraw(eventId, name, start, videoUrl) {
    const body = {
      name: name,
      start: start,
      videoUrl: videoUrl,
    };
    return this.httpClient.post(`${apiUrl}/api/v1/admin/${eventId}/draw`, body);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
}
