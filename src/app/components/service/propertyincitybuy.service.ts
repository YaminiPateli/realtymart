import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyincitybuyService {

  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  propertybuyincity(name: string, id: any): Observable<any> {
    const url = `${this.apiUrl}propertybuyincity/`;
    return this.http.get(url);
  }
}
