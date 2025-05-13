import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Verify } from '../../verify';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IsverifiedrentpropertyService {
  private apiUrl: string = environment.apiUrl ;

  constructor(private httpClient: HttpClient) {}

  getverifiedrentproperty(city:string): Observable<Verify[]> {
    return this.httpClient.get<Verify[]>(`${environment.apiUrl}isverifiedproperty/rent/${city}`).pipe(
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
