import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FeaturedCommercialProjects } from '../../featuredcommercialproject';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeaturedcommercialService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  featurecommercialget(city: string): Observable<any> {
    const url = `${this.apiUrl}featuredcommercialproject/${city}`;
    return this.http.get(url);
  }
}
