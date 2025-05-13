import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Topbuilders } from '../../Topbuilders';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TopbuilderslistingService {
  private apiUrl: string = environment.apiUrl + 'gettopbuilderlisting';

  constructor(private httpClient: HttpClient) {}

  topbuilderget(city:string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}/${city}`).pipe(
      catchError(this.errorHandler)
    );
  }

  private errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
