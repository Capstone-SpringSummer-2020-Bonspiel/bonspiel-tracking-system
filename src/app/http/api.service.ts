import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { HttpHeaders } from '@angular/common/http';

const apiURL: string = environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:4200'
  }),
  withCredentials: true,

}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) {}

  public getPokemon(){
    return this.httpClient.get(`${apiURL}/pokemon/ditto/`);
  }

  public getBeer(){
    return this.httpClient.get(`${apiURL}/breweries/5494`);
  }
}
