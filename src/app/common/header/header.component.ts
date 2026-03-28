import { Component, OnInit , AfterViewInit, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PropertyservicesService } from '../../components/service/propertyservices.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs'; // Import Observablez`
import { Location } from '@angular/common';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { GeolocationService } from '../../components/service/geolocation.service';
import { NgFor } from '@angular/common';
import { HeaderService } from 'src/app/components/service/header.service';
interface ApiResponse {
  data: any;
}


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements AfterViewInit{
  private apiUrl: string = environment.apiUrl;
  [x: string]: any;
  propertyget: any;
  data: any;
  result: any;
  showPassword = false;
  email: string = '';
  isOtpGenerated: boolean = false;
  enteredOtp: string = '';
  isOtpValid: boolean = false;
  generatedOtp: string = '';
  loading: boolean = false;
  locationCookie:any;
  latitude:any;
  cookie_location: any;
  longitude:any;
  checkToken:any;
  city: any;
  locationFooter: any;
  validCities: string[] = ['Ahmedabad', 'Rajkot', 'Surat', 'Vadodara', 'Mumbai', 'Navi Mumbai', 'Pune', 'Bangalore', 'NCR', 'Delhi', 'Gurgaon', 'Hyderabad'];

  constructor(
    public http: HttpClient,
    private PropertyservicesService: PropertyservicesService,
    private spinner: NgxSpinnerService,
    private route: Router,
    private location: Location,
    private elementRef: ElementRef,
    private toastr: ToastrService,
    private geolocationService: GeolocationService,
    private headerService: HeaderService
  ) {
    if(this.checkToken == null || this.checkToken == undefined){
      this.checkToken = localStorage.getItem('myrealtylogintoken');
    }

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 0);

    this.PropertyservicesService.propertyget()?.subscribe((data) => {
      this.propertyget = data;
      this.result = this.propertyget['responseData'];
    });
    this.spinner.show();
  }

  ngOnInit(): void {
    this.headerService.refresh$.subscribe((refresh) => {
      if (refresh) {
      this.getLocation();
      this.getLocations();
      if(this.checkToken == null || this.checkToken == undefined){
        this.checkToken = localStorage.getItem('myrealtylogintoken');
      }
        this.headerService.resetRefresh();
      }
    });
    this.getLocation();
    this.getLocations();
    if(this.checkToken == null || this.checkToken == undefined){
      this.checkToken = localStorage.getItem('myrealtylogintoken');
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
              this.locationFooter = latitude + ', ' + longitude;
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
      this.locationCookie = this.city;
    }
  }

  isValidCity(city: string): boolean {
    return this.validCities.includes(city);
  }

  updateCity(city: string) {
    this.city = city;
    const locationCookie = localStorage.getItem('location');
    if (this.city == locationCookie) {
      localStorage.removeItem('location');
    localStorage.setItem('location', city);
    }
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.spinner.hide();
      this.loading = true;
    }, 3000);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  logout() {
    const token = localStorage.getItem('myrealtylogintoken');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    const url = `${this.apiUrl}logout`;
    const data = { location: this.locationFooter };

    this.http.post<ApiResponse>(url, data, {headers}).subscribe(
      (response: any) => {
        if (response && response.status === true) {
        localStorage.removeItem('myrealtylogintoken');
        localStorage.removeItem('userId');
        localStorage.removeItem('email');
        localStorage.removeItem('contact_no');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('sessionId');
        const currentUrl = this.location.path();
          this.headerService.triggerRefresh();
        if(currentUrl == ''){
          window.location.reload();
        }else{
          this.route.navigate(['/']);
        }
      }
    });
  }

  getLocations(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.locationFooter = this.latitude + ', ' + this.longitude;
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation not supported by this browser.');
    }
  }

  onChange(e: any): void {
    this['type'] = e.target.value;
  }

  getregistereddata(information: any): void {
    this.http.post(`${this.apiUrl}register`, information)
      .subscribe(
        (response: any) => {
          if (response.status === true) {
            const elementToClick = this.elementRef.nativeElement.querySelector('#btncloseregister');
            if (elementToClick) {
              elementToClick.click();
            }
            setTimeout(() => {
              this.toastr.success('Registered Successfully.');
            }, 10);
          }
          const currentUrl = this.location.path();
          if (currentUrl == '/login') {
            window.location.reload();
          } else {
            this.route.navigate(['/login']);
          }
        },
        (error: any) => {
          console.error('Error sending data', error);
        }
      );
      }
    }

function handleScroll() {
  const header = document.querySelector('header');
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 150);
  }
}

window.addEventListener('scroll', handleScroll);
function ngOnInit() {
  throw new Error('Function not implemented.');
}
