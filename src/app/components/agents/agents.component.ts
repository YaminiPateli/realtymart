import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgentslistingService } from '../service/agentslisting.service';
import { AgentallprojectlistingService } from '../service/agentallprojectlisting.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css']
})

export class AgentsComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  agentget: any;
  data: any;
  agentlist: any[]=[];
  agentprojectcount: any;
  agentproject: any;
  agentlistcount: any;
  locationCookie:any;
  original: any[] = [];
  selectedSortOption: string = 'Relevance';
  isDropdownOpen: boolean = false;
  sortOptions: string[] = [
    'Relevance',
    'Price - Low to High',
    'Price - High to Low',
    'Most Recent'
  ];
  lastPage:any;
  currentPage: number = 1;
  isLoading:any;
  loading:any;
  scrollTimeout:any;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private http: HttpClient,
    private AgentService: AgentslistingService,
    private AgentprojectlistService: AgentallprojectlistingService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 0);
  }

  ngOnInit(): void {
    this.fetchAgentListing();
    // this.fetchAgentProjectListing();
    this.locationCookie = localStorage.getItem('location');
  }
  trackCustomActivity() {
    this.router.navigate(['agents-details/:name']);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  changeSortOption(option: string): void {
    this.selectedSortOption = option;
    this.isDropdownOpen = false;
    switch (option) {
      case 'Price - Low to High':
        this.agentlist = [...this.agentlist.sort((a, b) =>  this.convertToLac(a.total_price !== null ? a.total_price : a.rent_amount.toLocaleString()) - this.convertToLac(b.total_price !== null ? b.total_price : b.rent_amount.toLocaleString()))];
        break;
      case 'Price - High to Low':
        this.agentlist = [...this.agentlist.sort((a, b) =>  this.convertToLac(b.total_price !== null ? b.total_price : b.rent_amount.toLocaleString()) - this.convertToLac(a.total_price !== null ? a.total_price : a.rent_amount.toLocaleString()))];
        break;
      case 'Most Recent':
        this.agentlist = [...this.agentlist.sort((a, b) => this.sortByRecent(a, b))];
        break;
      case 'Relevance':
        this.agentlist = [...this.original];
        break;
      default:
        this.agentlist = [...this.original];
        break;
    }
  }
   convertToLac(priceString: string): number {
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

  sortByRecent(a: any, b: any): number {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateB - dateA;
  }

  // fetchAgentListing() {
  //   const city = this.route.snapshot.paramMap.get('city');

  //   if (city) {
  //     this.AgentService.agentlistget(city)?.subscribe((data) => {
  //       this.agentget = data;
  //       this.agentlist = this.agentget.data;
  //     });
  //   }
  // }

  fetchAgentListing() : void {
    const city = this.route.snapshot.paramMap.get('city');
    if (this.isLoading || this.currentPage > this.lastPage) return;
  
      this.isLoading = true;
      this.loading = true;
  
      const lastElement = document.querySelectorAll('.project-detail-box');
      const lastItem = lastElement[lastElement.length - 1];
      const lastItemOffset = lastItem ? lastItem.getBoundingClientRect().top : 0;
  
      this.http
        .get<any>(`${environment.apiUrl}listagents/${city}?page=${this.currentPage}`)
        .subscribe(
          (response) => {
            const oldScrollY = window.scrollY;
            this.agentlist = this.agentlist || [];
            this.agentlist = [...this.agentlist, ...(response.data?.data || []),];
            this.lastPage = response?.data?.last_page;          
            this.currentPage++;
            this.isLoading = false;
            this.loading = false;
            setTimeout(() => {
              if (lastItem) {
                const newOffset = lastItem.getBoundingClientRect().top;
                window.scrollTo(0, oldScrollY + (newOffset - lastItemOffset));
              }
            }, 100);
            this.setMetaTags(
              response.meta.title,
              response.meta.description,
            );
          },
          (error) => {
            console.error('Error fetching properties:', error);
            this.isLoading = false;
            this.loading = false;
          }
        );
    }

  // meta title
  setMetaTags(title: string, description: string) {
    this.titleService.setTitle(title);

    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({
      property: 'og:description',
      content: description,
    });
    // this.metaService.updateTag({ property: 'og:image', content: image });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({
      name: 'twitter:description',
      content: description,
    });
    // this.metaService.updateTag({ name: 'twitter:image', content: image });
  }
    
    @HostListener('window:scroll', [])
    onScroll(): void {
      const items = document.querySelectorAll('.project-detail-box');
      if (items.length < 20) return;
      const lastVisibleItem = items[items.length - 2];
      if (!lastVisibleItem) return;
      const rect = lastVisibleItem.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight && !this.isLoading) {
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
          this.fetchAgentListing();
        }, 200);
      }
    }
}
