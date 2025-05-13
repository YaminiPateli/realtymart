import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NewlyLaunched } from '../../newlylaunched';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewlylaunchedService {
  private apiUrl: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  getnewlylaunchedproperty(city: string): Observable<any> {
    const url = `${this.apiUrl}newlylaunched/${city}`;
    return this.httpClient.get(url)
    // return this.httpClient.get<NewlyLaunched[]>(`${this.apiUrl}/${city}`).pipe(
    //   catchError(this.errorHandler)
    // );
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
