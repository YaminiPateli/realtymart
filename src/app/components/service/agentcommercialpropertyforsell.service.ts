import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgentCommercialSell } from '../../agentcommercialpopertysell';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgentcommercialpropertyforsellService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getagentcommercialpropertysell(id: number): Observable<any> {
    const url = `${this.apiUrl}agentcommercialpropertysell/${id}`;
    return this.http.get(url);
  }
}