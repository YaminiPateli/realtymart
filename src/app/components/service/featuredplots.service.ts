import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeaturedplotsService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  featuredplotsget(city: string): Observable<any> {
    const url = `${this.apiUrl}featuredplotsprojects/${city}`;
    return this.http.get(url);
  }
}

