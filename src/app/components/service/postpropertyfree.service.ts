import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PostpropertyfreeService {

  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getpostPropertyFree(){
    const url = `${this.apiUrl}propertype`;
    return this.http.get(url);
  }
  getLandZone()
  {
    const url = `${this.apiUrl}landzone`;
    return this.http.get(url);
  }
  getBusinesssector(){
    const url = `${this.apiUrl}businesssector`;
    return this.http.get(url);
  }
  getLocalities(city:any){
    const url = `${this.apiUrl}toplocalities/${city}`;
    return this.http.get(url);
  }
  getCities(){
    const url = `${this.apiUrl}citiespostproperty`;
    return this.http.get(url);
  }
  getProjectList(locality:any){
    const url =`${this.apiUrl}projectlistforpostproperty/${locality}`;
    return this.http.get(url);
  }
}
