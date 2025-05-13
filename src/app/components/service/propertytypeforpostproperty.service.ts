import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PropertyTypeForPostProperty } from '../../propertytypeforpostproperty';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertytypeforpostpropertyService {
  private apiUrl: string = environment.apiUrl + 'propertytypeforpostproperty'; 

  constructor(private httpClient: HttpClient) {}

  getpropertytypeforpostproperty(): Observable<PropertyTypeForPostProperty[]> {
    return this.httpClient.get<PropertyTypeForPostProperty[]>(this.apiUrl).pipe(
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
