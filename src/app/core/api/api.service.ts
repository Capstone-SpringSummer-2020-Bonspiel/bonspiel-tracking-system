import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@app/../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { SpinnerService } from '@app/shared/services/spinner.service';

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
    return this.httpClient.get('https://restcountries.eu/rest/v2/all');
  }
}
