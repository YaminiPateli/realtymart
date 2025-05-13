import { Component,OnInit , AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PropertyservicesService } from '../../components/service/propertyservices.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { Observable } from 'rxjs'; // Import Observable
import { map } from 'rxjs/operators'; // Import map operator
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
interface ApiResponse {
  status: boolean;
  data: any; // You can specify the actual data type you expect here
  // Add other properties as needed based on the response structure
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private apiUrl: string = environment.apiUrl;
  [x: string]: any;
  propertyget: any;
  data: any;
  result: any = {};
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
  localStorage = localStorage;

  constructor(
    public http: HttpClient,
    private PropertyservicesService: PropertyservicesService,
    private spinner: NgxSpinnerService,
    private route: Router,
    private location: Location,
    private toastr: ToastrService
  ) {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 0);

    this.PropertyservicesService.propertyget()?.subscribe((data) => {
      this.propertyget = data;
      this.result = this.propertyget['responseData'];
    });
    this.spinner.show();
  }


  // loader script
  private getUserGeolocation(): Observable<GeolocationPosition> {
    return new Observable((observer) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next(position);
          observer.complete();
        },
        (error) => observer.error(error)
      );
    });
  }

  private getUserCityFromCoordinates(latitude: number, longitude: number): Observable<string> {
    return this.http
      .get<any>(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
      )
      .pipe(map((response) => response.address.city || 'Ahmedabad'));
  }

  ngOnInit() {
    const token = this.localStorage.getItem('myrealtylogintoken');
    if(token){
      this.route.navigate(['/']);
    }
    this.getUserGeolocation().subscribe(
      (position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;

        this.getUserCityFromCoordinates(this.latitude, this.longitude).subscribe(
          (userCity) => {
            this.cookie_location = 'Ahmedabad';
            localStorage.setItem('location', userCity);
            if (!userCity || userCity.trim() === '') {
              localStorage.setItem('location', 'Ahmedabad');
            }


            this.locationCookie = this.localStorage.getItem('location');
          },
          (error) => {
            console.error('Error getting user city:', error);
            localStorage.setItem('location', 'Ahmedabad');
              this.locationCookie = localStorage.getItem('location');
          }
        );
      },
      (error) => {
        console.error('Error getting user geolocation:', error);
        localStorage.setItem('location', 'Ahmedabad');
          this.locationCookie = localStorage.getItem('location');
      }
    );
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.spinner.hide();
      this.loading = true;
    }, 3000);
  }

  // loader script

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  isValidEmail(): boolean {
    // Regular expression for email validation
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailRegex.test(this.email);
  }

  // generateOtp() {
  //   // Your OTP generation logic here
  //   this.isOtpGenerated = true;
  // }

  // validateOtp() {
  //   // Your OTP validation logic here
  //   this.isOtpValid = true; // Set to true if OTP is valid
  // }

  onFormSubmit(form: any) {
    if (form.valid) {

    }
  }

  generateOtp(email: string) {
    if (!this.isValidEmail()) {
      // Handle invalid email address
      return;
    }

    const formattedEmail = email;

    const otpLength = 6;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.generatedOtp = otp.substring(0, otpLength);
    this.isOtpGenerated = true;
    this.isOtpValid = false;

    this.http.post(`${this.apiUrl}generateotp`, { email: formattedEmail }).subscribe(
      (response) => {
        // console.log('Data sent successfully', response);
      },
      (error) => {
        console.error('Error sending data', error);
      }
    );
  }


  validateOtp(email: string, otp: string) {
    const enteredOtp = parseInt(otp, 10); // Parse enteredOtp as a number
    // console.log('validateOtp method called');

    // You can now send a request with email and entered OTP
    const url = `${this.apiUrl}validateotp`;
    const data = { email: email, otp: enteredOtp };

    this.http.post<ApiResponse>(url, data).subscribe(
      (response: ApiResponse) => {

        // Store the token in session storage
        if (response && response.status === true) {
          localStorage.setItem('myrealtylogintoken', response.data.token);
          localStorage.setItem('email', response.data.email);
          localStorage.setItem('userId', response.data.id);
          this.route.navigate(['/']);
          this.toastr.success('Login successfully!');
        }
      },
      (error) => {
        console.error('Error sending data', error);
      }
    );
  }

  logout() {
    localStorage.removeItem('myrealtylogintoken');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('contact_no');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('sessionId');
    const currentUrl = this.location.path();
    if(currentUrl == '/'){
      window.location.reload();
    }else{
      this.route.navigate(['/']);
    }
  }

  getregistereddata(information: any): void {
    this.http.post(`${this.apiUrl}register`, information)
    .subscribe(
      (response: any) => {
        const currentUrl = this.location.path();
        if(currentUrl == '/home'){
          window.location.reload();
        }else{
          this.route.navigate(['/home']);
        }
      },
      (error: any) => {
        console.error('Error sending data', error);
      }
    );
  }
}
