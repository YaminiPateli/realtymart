import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  city: any;

  constructor() {}

  ngOnInit(): void {
    this.city = localStorage.getItem('location');    
  }
}
