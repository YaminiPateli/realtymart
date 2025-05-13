import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AllPropertyType } from '../../allpropertytype';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AllpropertytypeService {
  private apiUrl: string = environment.apiUrl + 'allPropertytype';

  constructor(private httpClient: HttpClient) {}

  getallpropertytype(): Observable<AllPropertyType[]> {
    return this.httpClient.get<AllPropertyType[]>(this.apiUrl).pipe(
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
