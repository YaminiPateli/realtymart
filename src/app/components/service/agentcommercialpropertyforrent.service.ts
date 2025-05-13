import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgentCommercialRent } from '../../agentcommercialpopertyrent';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgentcommercialpropertyforrentService {
  
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getagentcommercialpropertyrent(id: number): Observable<any> {
    const url = `${this.apiUrl}agentcommercialpropertyrent/${id}`;
    return this.http.get(url);
  }
}