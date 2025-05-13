import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BuilderpropertylistingService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getbuilderpropertylisting(id: number, type: string): Observable<any> {
    const url = `${this.apiUrl}builderallpropertylisting/${id}/${type}`;
    return this.http.get(url);
  }
}
