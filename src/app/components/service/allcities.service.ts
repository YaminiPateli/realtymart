import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AllCities } from '../../allcities';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AllcitiesService {
  private apiUrl: string = environment.apiUrl +'allcities';

  constructor(private httpClient: HttpClient) {}

  getallcities(): Observable<AllCities[]> {
    return this.httpClient.get<AllCities[]>(this.apiUrl).pipe(
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
