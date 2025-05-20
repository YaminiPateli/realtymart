import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-location-permission',
  templateUrl: './location-permission.component.html',
  styleUrls: ['./location-permission.component.css']
})
export class LocationPermissionComponent implements OnInit {
  showModal = false;

  ngOnInit(): void {
    const userDecision = localStorage.getItem('locationPermission');
    if (!userDecision) {
      this.showModal = true;
    }
  }

  allowLocation(): void {
    this.getLocation();
    localStorage.setItem('locationPermission', 'allowed');
    this.showModal = false;
    window.location.reload();
  }

  allowLocationOnce(): void {
    this.getLocation();
    this.showModal = false;
    window.location.reload();
  }

  rejectLocation(): void {
    localStorage.setItem('locationPermission', 'denied');
    this.showModal = false;
    localStorage.setItem('location', 'Ahmedabad');
    window.location.reload();
  }

  private getLocation(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Latitude:', position.coords.latitude);
        console.log('Longitude:', position.coords.longitude);
        // You can emit this to parent component or save it
      },
      (error) => {
        console.error('Location access denied or error:', error);
      }
    );
  }
}
