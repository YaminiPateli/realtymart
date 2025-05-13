import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalityService {
  private apiUrl: string = environment.apiUrl;

constructor(private httpClient: HttpClient) {}

getlocality(city: string): Observable<any> {
  const url = `${this.apiUrl}toplocalities/${city}`;
  return this.httpClient.get(url).pipe(
    catchError((error: any) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}
}
