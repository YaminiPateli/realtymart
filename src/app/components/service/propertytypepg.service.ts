import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PropertyTypePg } from '../../propertypg';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertytypepgService {
  private apiUrl: string = environment.apiUrl + 'propertytypepg';

  constructor(private httpClient: HttpClient) {}

  getpropertytypepg(): Observable<PropertyTypePg[]> {
    return this.httpClient.get<PropertyTypePg[]>(this.apiUrl).pipe(
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