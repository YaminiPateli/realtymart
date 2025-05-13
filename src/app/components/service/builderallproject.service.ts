import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BuilderallprojectlistingService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getallbuilderprojectlisting(name: string): Observable<any> {
    const url = `${this.apiUrl}builderallprojectlisting/${name}`;
    return this.http.get(url);
  }
}
