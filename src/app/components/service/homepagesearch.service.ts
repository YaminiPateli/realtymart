import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HomePageSearch } from '../../homepagesearch';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomepagesearchService {
  private apiUrl: string = environment.apiUrl + 'searchproperty';

  constructor(private httpClient: HttpClient) {}

  homepagesearch(): Observable<HomePageSearch[]> {
    return this.httpClient.get<HomePageSearch[]>(this.apiUrl).pipe(
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
