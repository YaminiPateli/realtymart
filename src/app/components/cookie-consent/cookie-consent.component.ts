import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.css']
})
export class CookieConsentComponent implements OnInit {
  showBanner: boolean = false;

  ngOnInit() {
    const consent = localStorage.getItem('cookie_consent');
    this.showBanner = !consent;
  }

  acceptCookies() {
    localStorage.setItem('cookie_consent', 'true');
    this.showBanner = false;
  }

  rejectCookies() {
    localStorage.setItem('cookie_consent', 'false');
    this.showBanner = false;
  }
}
