import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PropertyTypeResidential } from '../../propertyresidential';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertytyperesidentialService {
  private apiUrl: string = environment.apiUrl + 'propertytyperesidential';

  constructor(private httpClient: HttpClient) {}

  getpropertytyperesidential(): Observable<PropertyTypeResidential[]> {
    return this.httpClient.get<PropertyTypeResidential[]>(this.apiUrl).pipe(
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