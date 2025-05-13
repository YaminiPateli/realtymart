import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TopbuildersService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  topbuilderget(city: string): Observable<any> {
    const url = `${this.apiUrl}gettopbuilder/${city}`;
    return this.http.get(url);
  }
}
