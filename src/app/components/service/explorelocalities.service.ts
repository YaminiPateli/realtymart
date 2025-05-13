import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExplorelocalitiesService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  explorelocalitiesget(city: string): Observable<any> {
    const url = `${this.apiUrl}propertieslocalities/${city}`;
    return this.http.get(url);
  }
}