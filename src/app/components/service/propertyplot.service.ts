import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PropertyTypeOther } from '../../propertyother';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyplotService {
  private apiUrl: string = environment.apiUrl + 'plotPropertytype';

  constructor(private httpClient: HttpClient) {}

  getpropertytypeplot(): Observable<PropertyTypeOther[]> {
    return this.httpClient.get<PropertyTypeOther[]>(this.apiUrl).pipe(
      catchError(this.errorHandler)
    );
  }

  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
