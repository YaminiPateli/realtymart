import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PropertyTypeCommercial } from '../../propertycommercial';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertytypecommercialService {
  private apiUrl: string = environment.apiUrl + 'propertytypecommercial';

  constructor(private httpClient: HttpClient) {}

  getpropertytypecommercial(): Observable<PropertyTypeCommercial[]> {
    return this.httpClient.get<PropertyTypeCommercial[]>(this.apiUrl).pipe(
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