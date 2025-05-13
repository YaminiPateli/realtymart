import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PropertyDetails } from '../../propertyDetails';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertydetailsService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getpropertydetail(name: string, id: any): Observable<any> {
    const url = `${this.apiUrl}propertydetails/${name}/${id}`;
    return this.http.get(url);
  }
}