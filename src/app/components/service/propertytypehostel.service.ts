import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PropertyTypeHostel } from '../../propertyhostel';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertytypehostelService {
  private apiUrl: string = environment.apiUrl + 'propertytypehostel';

  constructor(private httpClient: HttpClient) {}

  getpropertytypehostel(): Observable<PropertyTypeHostel[]> {
    return this.httpClient.get<PropertyTypeHostel[]>(this.apiUrl).pipe(
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