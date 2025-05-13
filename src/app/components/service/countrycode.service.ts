import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CountryCode } from '../../CountryCode';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountrycodeService {
  private apiURL = environment.apiUrl + 'countrycode';

  constructor(private httpClient: HttpClient) {}

  getcountrycode(): Observable<CountryCode[]> {
    return this.httpClient.get<CountryCode[]>(this.apiURL).pipe(
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
