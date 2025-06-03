import { Component, HostListener, ViewChild, ElementRef, OnInit  } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

declare var $: any; // Declare jQuery
@Component({
  selector: 'app-selling-guide',
  templateUrl: './selling-guide.component.html',
  styleUrls: ['./selling-guide.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SellingGuideComponent {
  apiUrl = environment.apiUrl;
  contactStore!: FormGroup;
  bootstrap:any;
  userRole: any;
  userContactNo:any;
    formData = {
    role: '',
    property_for: '',
    contact_no: ''
  };

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private toastr: ToastrService,
    private http: HttpClient,
    private fb: FormBuilder,
    private elementRef: ElementRef,
    private route: Router,
    private toaster: ToastrService
  ) {
    const Property = localStorage.getItem('postProperty');
    if(Property == 'true'){
      this.route.navigate(['/post-property-free']);
    }
    this.setMetaTags(
      'Post Free Property Ads | Rent & Sell Property Online',
      '',
    );
    this.formData.role = localStorage.getItem('role') || '';
    this.formData.contact_no = localStorage.getItem('contact_no') || '';
    this.contactStore = this.fb.group({
      mobile: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.minLength(10), Validators.maxLength(10)]],
    });
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

  onSubmit(information:any) {
    const formData = information.form.value;
    if (!formData.contact_no || !formData.role || !formData.property_for) {
      this.toastr.error('Please fill all the fields');
      return;
    }
    
    localStorage.setItem('postProperty', 'true');
    localStorage.setItem('postPropertyData', JSON.stringify(information.form.value));
    this.route.navigate(['/post-property-free']);
  }

  getErrorMessage(controlName: string) {
    const control = this.contactStore.get(controlName);
     if (control?.hasError('pattern')) {
      return 'Invalid Phone No. Must be numeric';
    } else if (control?.hasError('minlength') || control?.hasError('maxlength')) {
      return 'Phone No. must be 10 digits';
    }

    return '';
  }

  @ViewChild('exampleModal') modal!: ElementRef;


  isFixed: boolean = true; // Initial state is fixed

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    this.isFixed = window.scrollY <= 2500;
  }

  ngOnInit() {
    this.autoOpenModal();
  }

  autoOpenModal() {
    setTimeout(() => {
      if (this.modal && this.modal.nativeElement) {
        $(this.modal.nativeElement).modal('show');
      }
    }, 15000); // 15 seconds delay
  }

  // addContact(clearaddform: any) {
  //   if (this.contactStore.valid) {
  //     const formData = {
  //       contact_no: this.contactStore.get('mobile')?.value,
  //       // Add other form fields as needed
  //     };

  //     this.http.post(`${this.apiUrl}sellingguideinquiry`, formData)
  //       .subscribe(
  //         (response: any) => {
  //           if (response.isSuccess === true) {
  //             window.location.reload();
  //             const elementToClick = this.elementRef.nativeElement.querySelector('.prt_popup');
  //               if (elementToClick) {
  //                 elementToClick.click();
  //               }
  //             clearaddform.resetForm();
  //           } else {
  //           }
  //         },
  //         (error: any) => {
  //           console.error('Error sending data', error);
  //           // Handle the error
  //         }
  //       );
  //   }
  // }

   addContact() {
    if (this.contactStore.valid) {
      const formData = {
        contact_no: this.contactStore.get('mobile')?.value,
      };

      this.http.post(`${this.apiUrl}helppostpropinq`, formData).subscribe(
        (response: any) => {
          if (response.status === true) {
            // Close popup and refresh
            const elementToClick = this.elementRef.nativeElement.querySelector('.prt_popup');
            if (elementToClick) {
              elementToClick.click();
            }
            this.contactStore.reset();
            this.toaster.success('Thank you for your interest! We will contact you soon.');
          } else {
            // Handle failed response
          }
        },
        (error: any) => {
          console.error('Error sending data', error);
        }
      );
    } else {
      this.contactStore.markAllAsTouched();
    }
  }

}
