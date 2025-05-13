import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../../companyservice';
import { environment } from '../../../environments/environment';
import { GeolocationService } from './geolocation.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyPropertyServiceService {
  private apiUrl = environment.apiUrl;
  placesName: any;
  city: any;

  constructor(private http: HttpClient, private geolocationService: GeolocationService) {}

  // This returns a promise when location is ready
  // initializeLocation(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //           const { latitude, longitude } = position.coords;

  //           this.getCity(latitude, longitude).then((result) => {
  //             // console.log(result);
              
  //             // this.placesName = result.placeName;
  //             resolve(result.placeName); // Resolve with the name
  //           });
  //         },
  //         (error) => {
  //           console.error('Error getting location', error);
  //           reject(error);
  //         }
  //       );
  //     } else {
  //       reject('Geolocation not supported');
  //     }
  //   });
  // }

  // getCity(lat: number, lng: number): Promise<any> {
  //   return fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
  //     .then(res => res.json())
  //     .then(data => {
  //       const address = data.address;
  //       this.placesName = address.suburb || '';
  //       this.city = address.state_district || '';
  //       return {
  //         placeName: this.placesName,
  //         display_name: data.display_name,
  //         full: address
  //       };
  //     });
  // }

  getCompanyServiceListing(name: string, id: any, lat: any, lng: any, city:any): Observable<any> {
    const url = `${this.apiUrl}getcompanylisting/${name}/${id}/${lat}/${lng}/${city}`;
    return this.http.get(url);
  }
}
