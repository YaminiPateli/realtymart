import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HotdealsserviceService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  hotdealget(city: string): Observable<any> {
    const url = `${this.apiUrl}hotdeal/${city}`;
    return this.http.get(url);
  }
}

