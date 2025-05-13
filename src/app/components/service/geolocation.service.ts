import { Injectable } from '@angular/core';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor() { }

  getCity(latitude: number, longitude: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      const latlng = { lat: latitude, lng: longitude };

      geocoder.geocode({ location: latlng }, (results: any, status: any) => {
        if (status === 'OK') {
          if (results[0]) {
            for (const component of results[0].address_components) {
              if (component.types.includes('locality')) {
                resolve(component.long_name);
                return;
              }
            }
            resolve('City not found');
          } else {
            resolve('No results found');
          }
        } else {
          reject('Geocoder failed due to: ' + status);
        }
      });
    });
  }
}
