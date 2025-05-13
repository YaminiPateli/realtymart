import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PgDetailsService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getpglisting(name: string, id: number): Observable<any> {
    const url = `${this.apiUrl}pgdetails/${name}/${id}`;
    return this.http.get(url);
  }
}
