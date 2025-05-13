import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExplorelocalitiesprojectlistingService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getlocalitiesprojects(localities: string): Observable<any> {
    const url = `${this.apiUrl}localitiesprojectlisting/${localities}`;
    return this.http.get(url);
  }
}
