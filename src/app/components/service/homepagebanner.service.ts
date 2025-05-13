import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HomePageBanner } from '../../homepagebanner';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomepagebannerService {
  private apiUrl: string = environment.apiUrl + 'homepagebanner';
  
    constructor(private httpClient: HttpClient) {}
  
    homepagebannerget(city:string): Observable<HomePageBanner[]> {
      return this.httpClient.get<HomePageBanner[]>(`${this.apiUrl}/${city}`).pipe(
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
  