import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BuilderProject } from '../../builderproject';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BuilderprojectService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getbuilderproject(id: number): Observable<any> {
    const url = `${this.apiUrl}builderproject/${id}`;
    return this.http.get(url);
  }
}
