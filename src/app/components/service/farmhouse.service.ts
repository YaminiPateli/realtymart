import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FarmHouse } from '../../farmhouse';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FarmhouseService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  featurefarmhouseget(city: string): Observable<any> {
    const url = `${this.apiUrl}featuredfarmhouseprojects/${city}`;
    return this.http.get(url);
  }
}

