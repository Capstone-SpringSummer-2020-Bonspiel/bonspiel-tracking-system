import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '@app/../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

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
  private eventIdSource = new BehaviorSubject(null);
  currentEventId$ = this.eventIdSource.asObservable();

  private eventSource = new BehaviorSubject(null);
  currentEvent$ = this.eventSource.asObservable();

  constructor(private httpService: HttpClient) {

    // Fetch default event ID & event object from the database
    this.getDefaultEventId().subscribe((rows: any) => {
      if (rows === null || rows === undefined) {
        console.log('Could not fetch curling events', 'ERROR');
        return;
      }

      const defaultEventId = rows[0].event_id;

      this.changeEventId(defaultEventId);
      console.log('DEFAULT EVENT ID', defaultEventId);

      this.getEvents().subscribe((rows: any) => {
        const defaultEvent = rows.find(e => e.id === defaultEventId);
        console.log('EVENTS', defaultEvent);
        this.changeEvent(defaultEvent);
      });
    });

  }

  /********************************************************************/

  // Getter/setters for service's behavior subjects

  changeEventId(newEventId: number) {
    this.eventIdSource.next(newEventId);
  }

  changeEvent(newEvent: any) {
    this.eventSource.next(newEvent);
  }

  get currentEventId() {
    return this.eventIdSource.getValue();
  }

  get currentEvent() {
    return this.eventSource.getValue();
  }

  /********************************************************************/

  // Miscellaneous

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

  public adHocQuery(query) {
    const body = {
      sql: query,
    };
    return this.httpService.post(
      `${environment.apiUrl}/api/v1/DANGEROUSADHOC`,
      body
    );
  }

  /********************************************************************/

  // Events
  public getEvents() {
    return this.httpService.get(`${environment.apiUrl}/api/v1/events`);
  }

  public createEvent(name, beginDate, endDate, completed, info, eventType) {
    const body = {
      name,
      beginDate,
      endDate,
      completed,
      info,
      eventType
    };
    return this.httpService.post(`${environment.apiUrl}/api/v1/admin/event`, body);
  }

  public editEvent(
    nameData,
    infoData,
    eventTypeData,
    completedData,
    beginDateData,
    endDateData,
    eventId
  ) {
    const body = {
      name: nameData,
      info: infoData,
      eventType: eventTypeData,
      completed: completedData,
      beginDate: beginDateData,
      endDate: endDateData,
    };
    console.log(body);
    return this.httpService.put(
      `${environment.apiUrl}/api/v1/admin/event/${eventId}`,
      body
    );
  }

  public deleteEvent(eventId) {
    console.log(eventId);
    return this.httpService.delete(
      `${environment.apiUrl}/api/v1/admin/event/${eventId}`
    );
  }
  // CASCADE DELETE will be setup on event_id in draw table, event_id in pool, and event_id in bracket.
  // All information from all tables related to the event will be deleted cleanly.

  public getDefaultEventId() {
    return this.httpService.get(`${environment.apiUrl}/api/v1/defaultEventId`);
  }

  public setDefaultEventId(eventId) {
    return this.httpService.post(`${environment.apiUrl}/api/v1/admin/defaultEventId/${eventId}`, {});
  }

  /********************************************************************/

  // Draws

  public getDraws(eventId) {
    return this.httpService.get(
      `${environment.apiUrl}/api/v1/events/${eventId}/draws`
    );
  }

  public createDraw(eventId, name, start, videoUrl) {
    const body = {
      name: name,
      start: start,
      videoUrl: videoUrl,
    };
    return this.httpService.post(
      `${environment.apiUrl}/api/v1/admin/${eventId}/draw`,
      body
    );
  }

  public editDraw(drawId, name, start, videoUrl) {
    const body = {
      name: name,
      start: start,
      videoUrl: videoUrl,
    };
    return this.httpService.put(
      `${environment.apiUrl}/api/v1/admin/draw/${drawId}`,
      body
    );
  }

  public deleteDraw(drawId) {
    return this.httpService.delete(
      `${environment.apiUrl}/api/v1/admin/draw/${drawId}`
    );
  }

  /********************************************************************/

  // Games

  public getGames(eventId) {
    return this.httpService.get(
      `${environment.apiUrl}/api/v1/events/${eventId}/games`
    );
  }

  public getGamesByTeam(eventId, teamId) {
    return this.httpService.get(
      `${environment.apiUrl}/api/v1/events/${eventId}/teams/${teamId}/games`
    );
  }

  public createGame(eventId, body) {
    return this.httpService.post(
      `${environment.apiUrl}/api/v1/admin/${eventId}/game`,
      body
    );
  }

  public editGame(gameId, body) {
    return this.httpService.put(
      `${environment.apiUrl}/api/v1/admin/game/${gameId}`, body
    );
  }

  public removeGame(gameId) {
    return this.httpService.delete(
      `${environment.apiUrl}/api/v1/admin/game/${gameId}`
    );
  }

  /********************************************************************* */

  // Organization

  public getAllOrganizations() {
    return this.httpService.get(`${environment.apiUrl}/api/v1/orgs`);
  }

  public getOrganizationByOrganizationId(orgId) {
    return this.httpService.get(`${environment.apiUrl}/api/v1/orgs/${orgId}`);
  }

  public createOrganization(fullNameData, shortNameData) {
    const body = {
      fullName: fullNameData,
      shortName: shortNameData,
    };
    return this.httpService.post(
      `${environment.apiUrl}/api/v1/admin/org`,
      body
    );
  }

  public editOrganization(fullNameData, shortNameData, orgId) {
    const body = {
      fullName: fullNameData,
      shortName: shortNameData,
    };
    return this.httpService.put(
      `${environment.apiUrl}/api/v1/admin/org/${orgId}`,
      body
    );
  }

  public removeOrganization(orgId) {
    console.log(`Removing orgId: ${orgId}`)
    return this.httpService.delete(`${environment.apiUrl}/api/v1/admin/org/${orgId}`);
  }

  // CASCADE DELETE will NOT be setup. If any curlers or curling team are in organization, then delete will error

  /********************************************************************/

  // Teams

  public getAllTeams() {
    return this.httpService.get(`${environment.apiUrl}/api/v1/teams`);
  }

  public getTeamsByEventId(eventId) {
    return this.httpService.get(
      `${environment.apiUrl}/api/v1/events/${eventId}/teams`
    );
  }

  public getTeams(teamId) {
    return this.httpService.get(`${environment.apiUrl}/api/v1/teams/${teamId}`);
  }

  public getScoresByTeam(eventId, teamId) {
    return this.httpService.get(
      `${environment.apiUrl}/api/v1/events/${eventId}/teams/${teamId}/scores`
    );
  }

  /********************************************************************/

  // Curler

  public getCurlersByOrganization(orgId) {
    return this.httpService.get(
      `${environment.apiUrl}/api/v1/orgs/${orgId}/curlers`
    );
  }

  public createCurler(
    name,
    position,
    affiliation,
    curlingTeamId,
    photoObj,
    throwingOrder
  ) {
    const body = {
      name: name,
      position: position,
      affiliation: affiliation,
      curlingTeamId: curlingTeamId,
      photoObj: photoObj,
      throwingOrder: throwingOrder,
    };
    return this.httpService.post(
      `${environment.apiUrl}/api/v1/admin/curler`,
      body
    );
  }

  public editCurler(
    name,
    position,
    affiliation,
    curlingTeamId,
    photoObj,
    throwingOrder,
    curlerId
  ) {
    const body = {
      name: name,
      position: position,
      affiliation: affiliation,
      curlingTeamId: curlingTeamId,
      photoObj: photoObj,
      throwingOrder: throwingOrder,
    };
    return this.httpService.put(
      `${environment.apiUrl}/api/v1/admin/curler/${curlerId}`,
      body
    );
  }

  public removeCurler(curlerId) {
    return this.httpService.delete(
      `${environment.apiUrl}/api/v1/admin/curler/${curlerId}`
    );
  }

  /********************************************************************* */

  // Bracket
  public getBracket(eventId) {
    return this.httpService.get(
      `${environment.apiUrl}/api/v1/${eventId}/brackets`
    );
  }

  public createBracket(nameData, eventId) {
    const body = {
      name: nameData,
    };
    return this.httpService.post(
      `${environment.apiUrl}/api/v1/admin/${eventId}/bracket`,
      body
    );
  }

  public editBracket(nameData, eventIdData, bracketId) {
    const body = {
      name: nameData,
      eventId: eventIdData,
    };
    console.log(body);
    return this.httpService.put(
      `${environment.apiUrl}/api/v1/admin/bracket/${bracketId}`,
      body
    );
  }

  public removeBracket(bracketId) {
    console.log('delete target bracket:');
    console.log(bracketId);
    return this.httpService.delete(
      `${environment.apiUrl}/api/v1/admin/bracket/${bracketId}`
    );
  }
  // CASCADE DELETE will NOT be setup. If any games exist in bracket, then delete will error out.

  public getTournamentBracketData(eventId) {
    return this.httpService.get(`${environment.apiUrl}/api/v1/events/${eventId}/generate-brackets`);
  }

  /********************************************************************* */

  // Pool
  public getPool(eventId) {
    return this.httpService.get(
      `${environment.apiUrl}/api/v1/${eventId}/pools`
    );
  }

  public createPool(nameData, eventId) {
    const body = {
      name: nameData,
    };
    return this.httpService.post(
      `${environment.apiUrl}/api/v1/admin/${eventId}/pool`,
      body
    );
  }

  public editPool(nameData, eventIdData, poolId) {
    const body = {
      name: nameData,
      eventId: eventIdData,
    };
    return this.httpService.put(
      `${environment.apiUrl}/api/v1/admin/pool/${poolId}`,
      body
    );
  }

  public removePool(poolId) {
    console.log('delete target pool:');
    console.log(poolId);
    return this.httpService.delete(
      `${environment.apiUrl}/api/v1/admin/pool/${poolId}`
    );
  }
  // CASCADE DELETE will NOT be setup. If any games exist in pool, then delete will error out.

  /********************************************************************* */

  public addTeamToEvent(teamId, eventId) {
    const body = {};
    return this.httpService.post(`${environment.apiUrl}/api/v1/admin/event/${eventId}/team/${teamId}`, body);
  }

  public removeTeamFromEvent(teamId, eventId) {
    return this.httpService.delete(`${environment.apiUrl}/api/v1/admin/event/${eventId}/team/${teamId}`);
  }
  // CASCADE DELETE will NOT be setup.
  // Manual check - If the team has played a game in the curling event, they must be removed before the team can be removed from the curling event

  /**********************************************************************/

  // Scores

  public createEndScore(gameId, endNumber, blank, curlingTeam1Scored, score) {
    const body = {
      endNumber: endNumber,
      blank: blank,
      curlingTeam1Scored: curlingTeam1Scored,
      score: score,
    };
    return this.httpService.post(
      `${environment.apiUrl}/api/v1/admin/${gameId}/end`,
      body
    );
  }

  public editEndScore(endId, blank, curlingTeam1Scored, score) {
    const body = {
      blank: blank,
      curlingTeam1Scored: curlingTeam1Scored,
      score: score,
    };
    return this.httpService.put(
      `${environment.apiUrl}/api/v1/admin/end/${endId}`,
      body
    );
  }

  public removeEndScore(endId) {
    return this.httpService.delete(
      `${environment.apiUrl}/api/v1/admin/end/${endId}`
    );
  }

  public getScoresByEvent(eventId) {
    return this.httpService.get(
      `${environment.apiUrl}/api/v1/events/${eventId}/scores`
    );
  }

  /**********************************************************************/

  // Curling Teams

  public createTeam(name, note, orgId) {
    const body = {
      name: name,
      note: note,
      orgId: orgId,
    };
    return this.httpService.post(
      `${environment.apiUrl}/api/v1/admin/team`,
      body
    );
  }

  public editTeam(teamId, name, note, orgId) {
    const body = {
      name: name,
      note: note,
      orgId: orgId,
    };
    return this.httpService.put(
      `${environment.apiUrl}/api/v1/admin/team/${teamId}`,
      body
    );
  }

  public deleteTeam(teamId) {
    return this.httpService.delete(
      `${environment.apiUrl}/api/v1/admin/team/${teamId}`
    );
  }
}
