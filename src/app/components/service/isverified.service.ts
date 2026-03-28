import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Verify } from '../../verify';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IsverifiedService {
  verifiedget(): Observable<Verify[]> {
    return this.httpClient.get<Verify[]>(this.apiUrl).pipe(
      catchError(this.errorHandler)
    );
  }

  // errorHandler already defined above, removed duplicate
  private apiUrl: string = environment.apiUrl + 'isverified';

  constructor(private httpClient: HttpClient) {}

  // verifiedget(): Observable<Verify[]> {
  //   return this.httpClient.get<Verify[]>(this.apiUrl).pipe(
  //     catchError(this.errorHandler)
  //   );
  // }

  verifyProperties(name:any,id:any) : Observable<any>{
    const url = `${environment.apiUrl}verifiedonpropertydetails/${name}/${id}`
    return this.httpClient.get(url);
  }

  similarProperties(name:any,id:any) : Observable<any>{
    const url = `${environment.apiUrl}similarproperty/${name}/${id}`
    return this.httpClient.get(url);
  }

  whoLikeProperties(name:any,id:any) : Observable<any>{
    const url = `${environment.apiUrl}whoviewdthisalsoliked/${name}/${id}`
    return this.httpClient.get(url);
  }

  otherNearByProperties(name:any,id:any) : Observable<any>{
    const url = `${environment.apiUrl}otherpropertiesnearby/${name}/${id}`
    return this.httpClient.get(url);
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
