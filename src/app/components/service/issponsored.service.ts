import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Sponsor } from '../../sponsor';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IssponsoredService {
  private apiUrl: string = environment.apiUrl + 'issponsored';

  constructor(private httpClient: HttpClient) {}

  sponsorget(): Observable<Sponsor[]> {
    return this.httpClient.get<Sponsor[]>(this.apiUrl).pipe(
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
