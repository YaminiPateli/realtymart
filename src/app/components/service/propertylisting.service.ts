import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PropertyListing } from '../../listingproperty';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertylistingService {
  private apiUrl: string = environment.apiUrl + 'allproperty';

  constructor(private httpClient: HttpClient) {}

  propertylisting(): Observable<PropertyListing[]> {
    return this.httpClient.get<PropertyListing[]>(this.apiUrl).pipe(
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
