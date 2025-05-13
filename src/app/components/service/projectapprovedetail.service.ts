import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectApproveDetailsService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getprojectapprovedetail(name: any, id: any): Observable<any> {
    const url = `${this.apiUrl}projectapprovaldetails/${name}/${id}`;
    return this.http.get(url);
  }
}