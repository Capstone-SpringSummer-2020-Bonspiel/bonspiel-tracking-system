import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@app/../environments/environment';
import { HttpHeaders } from '@angular/common/http';

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
  constructor(private httpClient: HttpClient) {
    console.log(`apiURL  ==>  ${apiURL}`);
  }

  public testAPI() {
    return this.httpClient.get('https://restcountries.eu/rest/v2/all'); // This returns an observable
  }

  public fetchCurlingEvents() {
    return this.httpClient.get(`${apiURL}/api/v1/fetch-curling-events`);
  }

  public createCurlingEvent(name, eventType, info, completed, beginDate, endDate) {
    const body = {
      name: name,
      eventType: eventType,
      info: info,
      completed: completed,
      beginDate: beginDate,
      endDate: endDate
    }
    return this.httpClient.post(`${apiURL}/api/v1/create-curling-event`, body);
  }

  public adHocQuery(query: string) {
    const body = {
      sql: query
    }
    return this.httpClient.post(`${apiURL}/api/v1/DANGEROUSADHOC`, body);
  }
}
