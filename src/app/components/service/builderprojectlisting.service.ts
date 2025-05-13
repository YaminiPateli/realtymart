import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BuilderprojectlistingService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getbuilderprojectlisting(city: string): Observable<any> {
    const url = `${this.apiUrl}allbuilderlisting/${city}`;
    return this.http.get(url);
  }
}