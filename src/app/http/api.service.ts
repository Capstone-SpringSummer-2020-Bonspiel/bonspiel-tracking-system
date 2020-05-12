import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { HttpHeaders } from '@angular/common/http';

const apiURL: string = environment.apiURL;
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
    console.log(`apiUrl  ==>  ${apiURL}`);
  }

  public testAPI() {
    return this.httpClient.get(`${apiURL}`);
  }
}
