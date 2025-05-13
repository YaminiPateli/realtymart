import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AgentList } from '../../AgentList';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgentslistingService {
  private apiUrl: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  agentlistget(city: string): Observable<any> {
    const url = `${this.apiUrl}listagents/${city}`;
    return this.httpClient.get(url);
  }

  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}

