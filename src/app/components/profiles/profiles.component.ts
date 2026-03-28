import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Options } from 'ngx-slider-v2';
import { environment } from '../../../environments/environment';
import { UserProfileService } from '../service/user-profile.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit, AfterViewInit {
  private apiUrl: string = environment.apiUrl;

  userDetailsData: any;
  userdetail: any;
  company_details: any;
  activeSubscriptionTab: string = 'subscriptions'; // default tab

  pemi = {
    min: 1000,
    max: 10000
  };

  changePasswordForm: any = {};
  roles = ['User', 'Builder', 'Agent', 'Service Provider', 'Pg'];

  poptions: Options = {
    floor: 0,
    ceil: 20000,
    step: 500,
    showTicks: true,
    animate: false
  };

  constructor(
    public http: HttpClient,
    private route: Router,
    private userprofileService: UserProfileService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.checkloggedIn();
    this.userdetails();
  }

  ngAfterViewInit(): void {
    // Listen for Bootstrap tab events
    const tabs = document.querySelectorAll('button[data-bs-toggle="pill"]');
    tabs.forEach(tab => {
      tab.addEventListener('shown.bs.tab', (event: any) => {
        const targetId = event.target.getAttribute('data-bs-target');
        if (targetId === '#pills-orderhistory') {
          this.activeSubscriptionTab = 'orderhistory';
        } else if (targetId === '#pills-subscriptions') {
          this.activeSubscriptionTab = 'subscriptions';
        }
      });
    });
  }

  update(): void {
    console.log('Min:', this.pemi.min, 'Max:', this.pemi.max);
  }

  checkloggedIn(): void {
    const checktoken = localStorage.getItem('myrealtylogintoken');
   if (checktoken == 'null' || checktoken == null) {
      this.route.navigate(['/login']);
    }
  }

  userdetails(): void {
    const token = localStorage.getItem('myrealtylogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http.get(`${this.apiUrl}profileDetails`, { headers }).subscribe(
        (userDetailsData: any) => {
          this.userDetailsData = userDetailsData.data;
          this.userdetail = this.userDetailsData?.userData;
          this.company_details = this.userDetailsData?.companyData;
         
          
        },
        (error) => {
          console.error('Error fetching user details', error);
        }
      );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  getLoggedIn(): void {
    const token = localStorage.getItem('myrealtylogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http.get(`${this.apiUrl}getbackendaccess`, { headers }).subscribe(
        (userDetailsData: any) => {
          console.log(userDetailsData);
        },
        (error) => {
          console.error('Error fetching backend access', error);
        }
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

      const oldPassword = changePasswordForm.value.old_password;
      const newPassword = changePasswordForm.value.new_password;
      const confirmPassword = changePasswordForm.value.confpwd;

      if (!oldPassword || !newPassword || !confirmPassword) {
        this.toastr.error('All fields are required!');
        return;
      }

      if (newPassword !== confirmPassword) {
        this.toastr.error('New Password and Confirm Password do not match!');
        changePasswordForm.resetForm();
        return;
      }

      this.http.post(`${this.apiUrl}customchangePassword`, changePasswordForm.value, { headers }).subscribe(
        (response: any) => {
          if (response.code === 300) {
            this.toastr.error('Password Does Not Match!');
          } else if (response.code === 200) {
            this.toastr.success('Password Changed Successfully!');
          }
          changePasswordForm.resetForm();
        },
        (error: any) => {
          if (error.status === 400 && error.error.errors) {
            const validationErrors = error.error.errors;
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
