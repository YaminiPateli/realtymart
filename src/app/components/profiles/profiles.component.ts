import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { Observable } from 'rxjs'; // Import Observable
import { map } from 'rxjs/operators'; // Import map operator
import { Location } from '@angular/common';
import { UserProfileService } from '../service/user-profile.service';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent {
  private apiUrl: string = environment.apiUrl;
  userDetailsData: any
  userdetail: any
  constructor(
    public http: HttpClient,
    private route: Router,
    private location: Location,
    private userprofileService: UserProfileService,
    private toastr: ToastrService
  ) { }
  changePasswordForm: any = {};
  // Assuming you have an array of roles
  roles = ['User', 'Builder', 'Agent', 'Service Povider', 'Pg'];

  // Your userdetail object

  ngOnInit() {
    this.checkloggedIn();
    this.userdetails();
  }

  checkloggedIn() {
    const checktoken = localStorage.getItem('myrealtylogintoken');
    if (!checktoken) {
      this.route.navigate(['/home']);
    }
  }

  userdetails() {
    const token = localStorage.getItem('myrealtylogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .get(`${this.apiUrl}profileDetails`, {
          headers,
        })
        .subscribe(
          (userDetailsData: any) => {
            this.userDetailsData = userDetailsData;
            this.userdetail = this.userDetailsData?.userData;
          },
          (error) => { }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  changePassword(changePasswordForm: NgForm): void {
    const token = localStorage.getItem('myrealtylogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      // Check if form data is empty
      if (changePasswordForm.value.new_password === null) {
        this.toastr.error('Form data is empty!');
        return;
      }

      const oldPassword = changePasswordForm.value.old_password;
      const newPassword = changePasswordForm.value.new_password;
      const confirmPassword = changePasswordForm.value.confpwd;

      if (newPassword === 'null' && confirmPassword === 'null' && oldPassword === 'null') {
        this.toastr.error('New Password and Confirm Password do not match!');
        changePasswordForm.resetForm();
        return;
      }

      // Check if new password and confirm password match
      if (newPassword !== confirmPassword) {
        this.toastr.error('New Password and Confirm Password do not match!');
        changePasswordForm.resetForm();
        return;
      }

      this.http.post(`${this.apiUrl}customchangePassword`, changePasswordForm.value, { headers })
        .subscribe(
          (response: any) => {
            if (response.code === 300) {
              this.toastr.error('Password Does Not Match!');
              changePasswordForm.resetForm();
            } else if (response.code === 200) {
              this.toastr.success('Password Changed Successfully!');
              changePasswordForm.resetForm();
            }
          },
          (error: any) => {
            if (error.status === 400 && error.error.errors) {
              // Handle validation errors
              const validationErrors = error.error.errors;
              // Assuming the API returns specific error messages for different scenarios
              if (validationErrors.old_password) {
                this.toastr.error(validationErrors.old_password[0]);
              } else if (validationErrors.new_password) {
                this.toastr.error(validationErrors.new_password[0]);
              }
            } else {
              console.error('Error sending data', error);
              this.toastr.error('An error occurred while changing the password.');
            }
          }
        );
    }
  }


}
