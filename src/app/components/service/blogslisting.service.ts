import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BlogList } from '../../bloglist';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogslistingService {
  private apiUrl: string = environment.apiUrl + 'bloglist';

  constructor(private httpClient: HttpClient) {}

  getblogslisting(): Observable<BlogList[]> {
    return this.httpClient.get<BlogList[]>(this.apiUrl).pipe(
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
