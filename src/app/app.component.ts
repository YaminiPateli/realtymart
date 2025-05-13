import { Component } from '@angular/core';

import { AfterViewInit, OnInit, HostListener,ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GeolocationService } from '../app/components/service/geolocation.service';

interface City {
  cid: number;
  cname: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isRegisterRoute = false;
  isRegisterThankyouRoute = false;
  title = 'my-reality-unlimited';
  city: any;
  city1:City[]=[];
  validcityforselected:any;

  constructor(
    private router: Router,
    public http: HttpClient,
    private geolocationService: GeolocationService
  ) {
    this.router.events.subscribe(() => {  
      // Check if the current route is `/register`
      this.isRegisterRoute = this.router.url === '/registration';
      this.isRegisterThankyouRoute = this.router.url === '/thank-you-register';
    });

    if ('caches' in window) {
      caches.keys().then((names) => {
      for (let name of names) caches.delete(name);
      });
      }
  }

  getLocation() {
    const locationCookie = localStorage.getItem('location');
    this.city = locationCookie;

    if (!locationCookie) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            this.geolocationService.getCity(latitude, longitude).then((city: string) => {
              if (this.isValidCity(city)) {
                this.updateCity(city);
              } else {
                this.updateCity('Ahmedabad');
              }
            }).catch((error: any) => {
              console.error('Error getting city from coordinates:', error);
              this.updateCity('Ahmedabad');
            });
          },
          (error) => {
            console.error('Error getting location', error);
            this.updateCity('Ahmedabad');
          }
        );
      } else {
        console.error('Geolocation not supported by this browser.');
        this.updateCity('Ahmedabad');
      }
    } else {
      // If 'location' cookie already exists, delete and set again with current city
      localStorage.removeItem('location');
      localStorage.setItem('location', this.city);
    }
  }
  
    fetchCities() {
      this.http.get<{ data: { id: number; name: string }[] }>(`${environment.apiUrl}cities`).subscribe(
        (response: any) => {
          this.city1 = response.responseData.map((city: any) => ({
            cid: city.id,
            cname: city.name
          }));
          this.validcityforselected = response.validCities;
          const defaultCity = this.city1.find(city => city.cname === this.city);
        },
        (error: any) => {
          console.error('API Error:', error);
        }
      );
    }

  isValidCity(city: string): boolean {
    return this.validcityforselected.includes(city);
  }

  updateCity(city: string) {
    this.city = city;
    const locationCookie = localStorage.getItem('location');
    if (this.city == locationCookie) {
      localStorage.removeItem('location');
    localStorage.setItem('location', city);
    }
  }
}
