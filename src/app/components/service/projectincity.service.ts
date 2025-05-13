import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectincityService {
  private apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) {}
  getprojectincity(city: string): Observable<any> {
    const url = `${this.apiUrl}projectincity/${city}`;
    return this.http.get(url);
  }
}