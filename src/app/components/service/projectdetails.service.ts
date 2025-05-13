import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectdetailsService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getprojectdetail(name: string, id: any,type:any): Observable<any> {
    const url = `${this.apiUrl}projectdetails/${name}/${id}/${type}`;
    return this.http.get(url);
  }

  getprojectdetail1(name: string, id: any): Observable<any> {
    const url = `${this.apiUrl}projectdetails/${name}/${id}`;
    return this.http.get(url);
  }
}