import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HomepagesearchService } from '../../components/service/homepagesearch.service'; 
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-matching-properties',
  templateUrl: './matching-properties.component.html',
  styleUrls: ['./matching-properties.component.css']
})
export class MatchingPropertiesComponent {
  homepagesearch: any;
  searchdata: any[] = [];
  original: any[] = [];
  filteredData: any[] = [];
  selectedSortOption: string = 'Relevance';
  isDropdownOpen: boolean = false;

  sortOptions: string[] = [
    'Relevance',
    'Price - Low to High',
    'Price - High to Low',
    'Most Recent'
  ];

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();

    if (navigation && navigation.extras.state) {
      const data = navigation.extras.state as any;
      this.searchdata = data.responseData;
      this.original = this.searchdata;
    }
    
  }
  changeSortOption(option: string): void {
    this.selectedSortOption = option;
    this.isDropdownOpen = false;
    switch (option) {
      case 'Price - Low to High':
        this.searchdata = this.searchdata.sort((a, b) => this.sortByPrice(a, b));
        break;
      case 'Price - High to Low':
        this.searchdata = this.searchdata.sort((a, b) => this.sortByPrice(b, a));
        break;
        case 'Most Recent':
          this.searchdata = this.searchdata.sort((a, b) => this.sortByRecent(a, b));
          break;
          case 'Relevance':
            this.searchdata = this.original;
            break;
      default:
        this.searchdata = this.original;
      break;
    }
  }
  
  private sortByPrice(a: any, b: any): number {
    const priceA = this.parsePrice(a.minprice);
    const priceB = this.parsePrice(b.minprice);

    return priceA - priceB;
  }
  
  private sortByRecent(a: any, b: any): number {
    const dateA = new Date(a.projectdetails.created_at).getTime();
    const dateB = new Date(b.projectdetails.created_at).getTime();
  
    return dateB - dateA;
  }

  filterByPrice(minPrice: number, maxPrice: number): void {
    this.filteredData = this.searchdata.filter(property => {
      const propertyMinPrice = this.parsePrice(property.minprice);
      const propertyMaxPrice = this.parsePrice(property.maxprice);

      return (
        (minPrice === null || propertyMinPrice >= minPrice) &&
        (maxPrice === null || propertyMaxPrice <= maxPrice)
      );
    });
  }

  private parsePrice(priceString: string): number {
    if (!priceString) return 0;

    let numericValue = parseFloat(priceString.replace(/[^0-9.]/g, '').trim());

    if (priceString.includes('cr')) {
      numericValue *= 100; // Convert crore to lac
    }

    return numericValue;
  }
  
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}