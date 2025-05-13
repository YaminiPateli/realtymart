import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertytypesbuyinService {
  private apiUrl: string = environment.apiUrl;
  
  constructor(private http: HttpClient) {}

  getpropertytypesbuyin(type: string, city: string): Observable<any> {
    const url = `${this.apiUrl}propertytypesbuyin/${type}/${city}`;
    return this.http.get(url);
  }
}
