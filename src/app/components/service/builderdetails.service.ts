import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BuilderDetail } from '../../builderdetail';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BuilderdetailsService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getsinglebuilderdetail(id: any): Observable<any> {
    const url = `${this.apiUrl}getbuilderprofile/${id}`;
    return this.http.get(url);
  }
}
