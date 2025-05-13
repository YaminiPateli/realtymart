import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BuilderallprojectlistingService } from '../service/builderallproject.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-godrej-properties',
  templateUrl: './builder-project.component.html',
  styleUrls: ['./builder-project.component.css']
})
export class BuilderAllProjectListComponent {
  allbuilderprojectData:any;
  allbuilderpropertycount:any;
  allbuilderproject:any[] = [];
  isDropdownOpen: boolean = false;
  selectedSortOption: string = 'Relevance';
  original: any[] = [];
  filteredData: any[] = [];
  sortOptions: string[] = [
    'Relevance',
    'Price - Low to High',
    'Price - High to Low',
    'Most Recent'
  ];
  builderDetails: any;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    public http: HttpClient,
    private builderallprojectlistingService: BuilderallprojectlistingService,
    private route: ActivatedRoute
  ) {
    const builderId = this.route.snapshot.paramMap.get('id');
    const propertytype = this.route.snapshot.paramMap.get('type');
  }

  ngOnInit(): void {
    this.loadAllBuilders();
  }
  loadAllBuilders(): void {
    const propertytype = this.route.snapshot.paramMap.get('name');

    if (propertytype) {
      this.builderallprojectlistingService.getallbuilderprojectlisting(propertytype).subscribe(
        (response: any) => {
          this.allbuilderprojectData = response.data;
          this.allbuilderproject = this.allbuilderprojectData;
          this.builderDetails = response.builderDetails;
          this.original = [...this.allbuilderproject];
          this.setMetaTags(
            response.meta.title,
            response.meta.description,
          );
        },
        (error: any) => {
          console.error('Error fetching all builders:', error);
        }
      );
    }
  }

  // meta title
  setMetaTags(title: string, description: string) {
    this.titleService.setTitle(title);

    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description, });
    // this.metaService.updateTag({ property: 'og:image', content: image });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description, });
    // this.metaService.updateTag({ name: 'twitter:image', content: image });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  changeSortOption(option: string): void {
    this.selectedSortOption = option;
    this.isDropdownOpen = false;
    switch (option) {
      case 'Price - Low to High':
        this.allbuilderproject = [...this.allbuilderproject.sort((a, b) => this.sortByPrice(a, b))];
        break;
      case 'Price - High to Low':
        this.allbuilderproject = [...this.allbuilderproject.sort((a, b) => this.sortByPrice(b, a))];
        break;
      case 'Most Recent':
        this.allbuilderproject = [...this.allbuilderproject.sort((a, b) => this.sortByRecent(a, b))];
        break;
      case 'Relevance':
        this.allbuilderproject = [...this.original];
        break;
      default:
        this.allbuilderproject = [...this.original];
        break;
    }
  }

  private convertToLac(priceString: string): number {
    if (!priceString) return 0;
    let numericValue = parseFloat(priceString.replace(/[^0-9.]/g, '').trim());
  
    if (priceString.toLowerCase().includes('cr')) {
      numericValue *= 100; 
    } else if (priceString.toLowerCase().includes('lac')) {
    } else {
      numericValue = numericValue / 100000; 
    }
  
    return numericValue;
  }


  private sortByPrice(a: any, b: any): number {
    const priceA = this.convertToLac(a.project_minimum_price);
    const priceB = this.convertToLac(b.project_maximum_price);
    return priceA - priceB;
  }
  
  private sortByRecent(a: any, b: any): number {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateB - dateA;
  }

  filterByPrice(minPrice: number, maxPrice: number): void {
    this.filteredData = this.allbuilderproject.filter((property:any) => {
      const propertyMinPrice = this.convertToLac(property.minprice);
      const propertyMaxPrice = this.convertToLac(property.maxprice);

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
  
}
