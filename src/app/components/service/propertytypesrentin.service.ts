import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertytypesrentinService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getpropertytypesrentin(type: string, city: string): Observable<any> {
    const url = `${this.apiUrl}propertytypesrentin/${type}/${city}`;
    return this.http.get(url);
  }
}
