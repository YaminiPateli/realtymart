import { Component, HostListener, ViewChild, ElementRef, OnInit  } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

declare var $: any; // Declare jQuery


@Component({
  selector: 'app-selling-guide',
  templateUrl: './selling-guide.component.html',
  styleUrls: ['./selling-guide.component.css']
})
export class SellingGuideComponent {
  apiUrl = environment.apiUrl;
  contactStore!: FormGroup;
  bootstrap:any;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private elementRef: ElementRef,
  ) {
    this.contactStore = this.fb.group({
      mobile: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.minLength(10), Validators.maxLength(10)]],
    });
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

  addContact(clearaddform: any) {
    if (this.contactStore.valid) {
      const formData = {
        contact_no: this.contactStore.get('mobile')?.value,
        // Add other form fields as needed
      };

      this.http.post(`${this.apiUrl}sellingguideinquiry`, formData)
        .subscribe(
          (response: any) => {
            if (response.isSuccess === true) {
              window.location.reload();
              const elementToClick = this.elementRef.nativeElement.querySelector('.prt_popup');
                if (elementToClick) {
                  elementToClick.click();
                }
              clearaddform.resetForm();
            } else {
            }
          },
          (error: any) => {
            console.error('Error sending data', error);
            // Handle the error
          }
        );
    }
  }

}
