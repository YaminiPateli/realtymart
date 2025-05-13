import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeaturedbunlowsvillasService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  featurebunglowsvillasget(city: string): Observable<any> {
    const url = `${this.apiUrl}featuredbungalowsvillasprojects/${city}`;
    // const url = `${this.apiUrl}featuredbungalowsvillasprojects/Ahmedabad`;
    return this.http.get(url);
  }
}

