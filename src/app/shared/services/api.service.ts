import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private host: string;

  constructor(private _http: HttpClient) {
    this.host = 'http://127.0.0.1:8000';
  }

  get(apiUrl: string) {
    return this._http.get(`${this.host}${apiUrl}`);
  }

  post(apiUrl: string, data: any) {
    return this._http.post(`${this.host}${apiUrl}`, data);
  }
}
