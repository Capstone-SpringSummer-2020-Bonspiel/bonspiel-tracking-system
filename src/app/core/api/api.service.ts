import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@app/../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

const apiURL: string = environment.apiURL;
// const apiURL = 'http://localhost:8080';
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

  constructor(private httpClient: HttpClient) {
    console.log(`apiURL  ==>  ${apiURL}`);
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
    return this.httpClient.post(`${apiURL}/api/v1/create-curling-event`, body);
  }

  /********************************************************************/

  public adHocQuery(query) {
    const body = {
      sql: query,
    };
    return this.httpClient.post(`${apiURL}/api/v1/DANGEROUSADHOC`, body);
  }

  /********************************************************************/

  public getEvents() {
    return this.httpClient.get(`${apiURL}/api/v1/events`);
  }

  public getTeams(eventId) {
    return this.httpClient.get(`${apiURL}/api/v1/events/${eventId}/teams`);
  }

  public getGames(eventId) {
    return this.httpClient.get(`${apiURL}/api/v1/events/${eventId}/games`);
  }

  public getDraws(eventId) {
    return this.httpClient.get(`${apiURL}/api/v1/events/${eventId}/draws`);
  }

  public getGamesByTeam(eventId, teamId) {
    return this.httpClient.get(
      `${apiURL}/api/v1/events/${eventId}/teams/${teamId}/games`
    );
  }

  public getScoresByTeam(eventId, teamId) {
    return this.httpClient.get(
      `${apiURL}/api/v1/events/${eventId}/teams/${teamId}/scores`
    );
  }

  public getScoresByEvent(eventId) {
    return this.httpClient.get(`${apiURL}/api/v1/events/${eventId}/scores`);
  }

  public getTeam(teamId) {
    return this.httpClient.get(`${apiURL}/api/v1/teams/${teamId}`);
  }

  /********************************************************************/

  public createDraw(eventId, name, start, video_url) {
    const body = {
      name: name,
      start: start,
      video_url: video_url,
    };
    return this.httpClient.post(`${apiURL}/api/v1/admin/${eventId}/draw`, body);
  }

  public createCurler(name, position, affiliation, curlingTeamId) {
    const body = {
      name: name,
      position: position,
      affiliation: affiliation,
      curlingTeamId: curlingTeamId,
    };
    return this.httpClient.post(`${apiURL}/api/v1/admin/curler`, body);
  }

  public editCurler(name, position, affiliation, curlingTeamId, curlerId) {
    const body = {
      name: name,
      position: position,
      affiliation: affiliation,
      curlingTeamId: curlingTeamId,
    };
    return this.httpClient.put(
      `${apiURL}/api/v1/admin/curler/${curlerId}`,
      body
    );
  }

  public removeCurler(curlerId) {
    return this.httpClient.delete(`${apiURL}/api/v1/admin/curler/${curlerId}`);
  }
}
