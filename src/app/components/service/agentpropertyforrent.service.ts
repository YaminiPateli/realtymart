import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgentPropertRent } from '../../agentpopertyrent';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AgentpropertyforrentService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getagentresidentialpropertyrent(id: number): Observable<any> {
    const url = `${this.apiUrl}agentresidentialpropertyrent/${id}`;
    return this.http.get(url);
  }
}