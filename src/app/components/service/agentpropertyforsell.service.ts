import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgentPropertSell } from '../../agentpopertysell';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgentpropertyforsellService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getagentresidentialpropertysell(id: number): Observable<any> {
    const url = `${this.apiUrl}agentresidentialpropertysell/${id}`;
    return this.http.get(url);
  }
}