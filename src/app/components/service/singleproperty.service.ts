import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SinglePropertyService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPropertyServiceListing(name: string): Observable<any> {
    const url = `${this.apiUrl}getpropertyservicelisting/${name}`;
    const token = localStorage.getItem('myrealtylogintoken');
    const headers = { 'Authorization': `Bearer ${token}` };
  
    return this.http.get(url, { headers });
  }  
}
