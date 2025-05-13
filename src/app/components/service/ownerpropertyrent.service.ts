import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OwnerProperty } from '../../../app/components/service/ownerproperty.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OwnerpropertyrentService {
  private citys: any;
  private apiUrl: string;

  constructor(private httpClient: HttpClient) {
    this.citys = localStorage.getItem('location');
    this.apiUrl = environment.apiUrl + `isownerproperty/rent/${this.citys}`;
  }

  getownerpropertyrent(): Observable<OwnerProperty[]> {
    return this.httpClient.get<OwnerProperty[]>(this.apiUrl).pipe(
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
