import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SingleagentprojectlistingrentService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getagentprojectsrent(id: number): Observable<any> {
    const url = `${this.apiUrl}singleagentprojectlistingrent/${id}`;
    return this.http.get(url);
  }
}