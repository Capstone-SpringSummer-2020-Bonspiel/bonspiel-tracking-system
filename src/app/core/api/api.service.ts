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

  /********************************************************************/

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

  public getTeam(teamId) {
    return this.httpClient.get(`${apiUrl}/api/v1/teams/${teamId}`);
  }

  public getAllOrgs() {
    return this.httpClient.get(`${apiUrl}/api/v1/orgs`);
  }

  public getOrgs(orgId) {
    return this.httpClient.get(`${apiUrl}/api/v1/orgs/${orgId}`);
  }

  /********************************************************************/

  public createDraw(eventId, name, start, videoUrl) {
    const body = {
      name: name,
      start: start,
      videoUrl: videoUrl,
    };
    return this.httpClient.post(`${apiUrl}/api/v1/admin/${eventId}/draw`, body);
  }

  public editDraw(drawId, name, start, videoUrl) {
    const body = {
      name: name,
      start: start,
      videoUrl: videoUrl,
    };
    return this.httpClient.put(`${apiUrl}/api/v1/admin/draw/${drawId}`, body);
  }

  public deleteDraw(drawId) {
    return this.httpClient.delete(`${apiUrl}/api/v1/admin/draw/${drawId}`);
  }

  public createCurler(name, position, affiliation, curlingTeamId) {
    const body = {
      name: name,
      position: position,
      affiliation: affiliation,
      curlingTeamId: curlingTeamId,
    };
    return this.httpClient.post(`${apiUrl}/api/v1/admin/curler`, body);
  }

  public editCurler(name, position, affiliation, curlingTeamId, curlerId) {
    const body = {
      name: name,
      position: position,
      affiliation: affiliation,
      curlingTeamId: curlingTeamId,
    };
    return this.httpClient.put(
      `${apiUrl}/api/v1/admin/curler/${curlerId}`,
      body
    );
  }

  public removeCurler(curlerId) {
    return this.httpClient.delete(`${apiUrl}/api/v1/admin/curler/${curlerId}`);
  }
}
