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
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
interface ApiResponse {
  status: boolean;
  data: any; // You can specify the actual data type you expect here
  // Add other properties as needed based on the response structure
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone:true,
  imports: [NgIf, FormsModule],
})
export class LoginComponent {
  private apiUrl: string = environment.apiUrl;
  [x: string]: any;
  propertyget: any;
  data: any;
  result: any = {};
  showPassword = false;
  contact_no: string = '';
  isOtpGenerated: boolean = false;
  enteredOtp: string = '';
  isOtpValid: boolean = false;
  generatedOtp: string = '';
  loading: boolean = false;
  locationCookie:any;
  latitude:any;
  cookie_location: any;
  longitude:any;
  showContactError: boolean = false;
  isMobileNumberDisabled: boolean = false;
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
            this.localStorage.setItem('location', userCity);
            if (!userCity || userCity.trim() === '') {
              this.localStorage.setItem('location', 'Ahmedabad');
            }

            this.locationCookie = this.localStorage.getItem('location');
          },
          (error) => {
            console.error('Error getting user city:', error);
              this.localStorage.setItem('location', 'Ahmedabad');
              this.locationCookie = this.localStorage.getItem('location');
          }
        );
      },
      (error) => {
        console.error('Error getting user geolocation:', error);
          this.localStorage.setItem('location', 'Ahmedabad');
          this.locationCookie = this.localStorage.getItem('location');
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

  // isValidEmail(): boolean {
  //   // Regular expression for email validation
  //   const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  //   return emailRegex.test(this.contact_no);
  // }

  // isValidContactNumber(): boolean {
  //   return this.contact_no.length == 10;
  // }


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

 generateOtp(contact_no: any) {
    if (contact_no?.length !== 10 || !/^\d+$/.test(contact_no)) {
        this.showContactError = true;
        return
    }
    // If the mobile number is valid, generate a 6-digit OTP
    const otpLength = 6;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.generatedOtp = otp.substring(0, otpLength);
    this.isOtpValid = false;

    // Send the OTP generation request to the backend (you can include the contact number)
    this.http.post(`${this.apiUrl}generateotp`, { contact_no: this.contact_no }).subscribe(
        (response: any) => {
          if(response?.code == 1){
            this.toastr.error('This Mobile No Not Found!')
          } else {
            this.isMobileNumberDisabled = true;
            this.isOtpGenerated = true;
          }
        },
        (error) => {
            console.error('Error generating OTP:', error);
        }
    );
}


  validateNumberInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Only allow numeric characters (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  validContactNumber(event:any) {
    const inputValue = event.target.value;
    const phonePattern = /^[0-9]{10}$/;
    this.showContactError = !phonePattern.test(inputValue);
    // Reset the error message if the contact number is not 10 digits
    // this.showContactError = this.contact_no?.length === 10 ? false : this.showContactError;
  }

  validateOtp(contact_no: string, otp: any) {
    if(otp?.length !=4){
      this.toastr.error('Please Enter 4 Digit OTP');
      return;
    }

    const enteredOtp = parseInt(otp, 10);

    const url = `${this.apiUrl}validateotp`;
    const data = { contact_no: contact_no, otp: enteredOtp };

    this.http.post<ApiResponse>(url, data).subscribe(
      (response: any) => {
        // Store the token in session storage
        if (response && response.status === true) {
          localStorage.setItem('myrealtylogintoken', response.data.token);
          localStorage.setItem('contact_no', response.data.contact_no);
          localStorage.setItem('userId', response.data.id);
          localStorage.setItem('role', response.data.role);
          localStorage.setItem('name',response.data.name);
          localStorage.setItem('email',response.data.email);
          this.route.navigate(['/']);
          this.toastr.success('Login successfully!');
        } else if(response && response.code == 1) {
          this.toastr.error('Invalid OTP');
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
    if(currentUrl == ''){
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
        if(currentUrl == '/'){
          window.location.reload();
        }else{
          this.route.navigate(['/']);
        }
      },
      (error: any) => {
        console.error('Error sending data', error);
      }
    );
  }
}
