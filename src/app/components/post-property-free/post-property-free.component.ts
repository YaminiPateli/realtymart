import { Component, OnInit, Injectable, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PostpropertyfreeService } from '../service/postpropertyfree.service';
import { FormsModule, NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-post-property-free',
  templateUrl: './post-property-free.component.html',
  styleUrls: ['./post-property-free.component.css'],
})
export class PostPropertyFreeComponent {
  submitForm = new FormGroup({
    property_for: new FormControl(null, [Validators.required]),
    property_type: new FormControl('', [Validators.required]),
    property_status: new FormControl(null, [Validators.required]),
    property_city: new FormControl('', [Validators.required]),
    property_locality: new FormControl('', [Validators.required]),
    property_address: new FormControl(null, [Validators.required]),
    project_id: new FormControl(null, [Validators.required]),
    landmarks: new FormControl(null, []),
    land_zone: new FormControl('', []),
    property_price_show: new FormControl(null, []),
    property_description: new FormControl(null, [Validators.required]),
    property_facilities: new FormControl(null, [Validators.required]),
    property_main_img: new FormControl(null, [Validators.required]),
    property_img: new FormControl(null, []),
    current_business_sector: new FormControl('', []),
    overlooking: new FormControl(null, [Validators.required]),
    lift: new FormControl('', []),
    is_corner_property: new FormControl(null, [Validators.required]),
    is_road_facing: new FormControl(null, [Validators.required]),
    terms_conditions: new FormControl(null, [Validators.required]),
    no_of_open_sides: new FormControl('', []),
    width_of_road_facing_the_plot: new FormControl(null, []),
    any_construction_done: new FormControl(null, []),
    boundary_wall_made: new FormControl(null, []),
    is_in_gated_colony: new FormControl(null, []),
    total_units: new FormControl(null, []),
    total_towers: new FormControl(null, []),
    water_availability: new FormControl('', []),
    status_of_electricity: new FormControl('', []),
    additional_rooms: new FormControl(null, []),
    car_parking: new FormControl('', []),
    car_parking_open: new FormControl('', []),
    floors_allowed_for_construction: new FormControl('', []),
    modifyInteriors: new FormControl(null, []),
    avbldate: new FormControl(null, []),
    age_of_construction: new FormControl('', []),
    rent_amount: new FormControl(null, []),
    security_amount: new FormControl(null, []),
    maintanance_charges: new FormControl(null, []),
    maintenance_charges_per: new FormControl('', []),
    personal_washroom: new FormControl(null, []),
    pantry_cafeteria: new FormControl(null, []),
    carpet_area: new FormControl(null, []),
    carpet_area_in: new FormControl('', []),
    built_up_area: new FormControl(null, []),
    built_up_area_in: new FormControl('', []),
    super_area: new FormControl(null, []),
    super_area_in: new FormControl('', []),
    ploat_area: new FormControl(null, []),
    ploat_area_in: new FormControl('', []),
    plot_length: new FormControl(null, []),
    plot_width: new FormControl(null, []),
    covered_area: new FormControl(null, []),
    covered_area_in: new FormControl('', []),
    total_price: new FormControl(null, []),
    lac_or_cr: new FormControl('', []),
    price_per_sq_ft: new FormControl(null, []),
    booking_or_token_ammount: new FormControl(null, []),
    thousand_lac_or_cr: new FormControl('', []),
    flooring: new FormControl('', []),
    possession_status: new FormControl('', []),
    facing: new FormControl('', []),
    washroom: new FormControl('', []),
    transaction_type: new FormControl('', []),
    available_from_month: new FormControl('', []),
    available_from_year: new FormControl('', []),
    available_from: new FormControl('', []),
    currently_leased_out: new FormControl('', []),
    assured_returns: new FormControl('', []),
    whom_property_leased: new FormControl('', []),
    monthly_rent: new FormControl('', []),
    leased_on: new FormControl('', []),
    current_business_sector_other: new FormControl('', []),
    in_business_since: new FormControl('', []),
    rate_of_return: new FormControl('', []),
    cmpltprice: new FormControl('', []),
    basic_price: new FormControl('', []),
    floor_plc: new FormControl('', []),
    open_car_parking: new FormControl('', []),
    open_car_parking_unit: new FormControl('', []),
    facing_plc: new FormControl('', []),
    price_includes: new FormControl('', []),
    user_id: new FormControl('', []),
    builder_id: new FormControl('', []),
    agent_id: new FormControl('', []),
    owner_type: new FormControl('', []),
    total_no_of_flats: new FormControl('', []),
    floor_no: new FormControl('', []),
    bathroom: new FormControl('', []),
    bedroom: new FormControl('', []),
    total_floor: new FormControl('', []),
    balconies: new FormControl('', []),
    furnishing_status: new FormControl('', []),
    bedrooms: new FormControl('', []),
    bedroomsize: this.fb.array([]),
    bedroom_length: new FormControl('', []),
    bedroom_width: new FormControl('', [])
  });

  floorOptions: number[] = Array.from({ length: 200 }, (_, i) => i + 1);
  selectedPropertyFor:any;
  selectedPossessionStatus:any;
  selectedAgeOfConstruction:any;
  selectedCurrentBusinessSector:any;
  selectedTransactionType:any;
  selectedAssuredReturns:any;
  selectedAvailabaleDate:any;
  isLeased:any;
  totalcompletePrice:any;
  availableYears: number[] = [];
  businessYears: number[] = [];
  userRoleGet : any;
  propertyType: any;
  landZone: any;
  BusinessSector: any;
  localities: any;
  projectList:any;
  cities: any;
  numberOfBed: any;
  selectedBedRoom: any;
  selectedBathRoom: any;
  selectedOption: any;
  selectedBalcony: any;
  selectedBalconiesOption: any;
  selectedBathRoomOption: any;
  selectedFloor: any;
  selectedFloorOption: any;
  selectedTotalFloor: any;
  selectedFurnishType: string = '';
  selectedTotalFloorOption: any;
  selectedFlatSociety: any = '';
  selectedPropertyType:any;
  isDropdownOpen = false;
  isbalconiDropdownOpen = false;
  isbathRoomDropdownOpen = false;
  isfloorDropdownOpen = false;
  isfloorNoDropdownOpen = false;
  showSection: boolean = false;
  showBalconySection: boolean = false;
  showBathRoomSection: boolean = false;
  showFloorSection: boolean = false;
  selectPreValue: any = '';

  selectedValue = '5+';
  selectedBalconiesValue = '3+';
  selectBathRoomsValue = '3+';
  floorselectedValue: any = '15+';
  totalFloorselectedValue: any = '15+';
  floorNoselectedValue: any = '5+';
  // selectedDate: any = '';

  options = ['5', '6', '7', '8', '9', '10', ' > 10'];
  baconiesoptions = ['4', '5', '6', '7', '8', '9', '10', '> 10'];
  bathRoomoptions = ['4', '5', '6', '7', '8', '9', '10', '> 10'];
  floorNoOptions: any = Array.from({ length: 196 }, (_, i) =>
    (i + 5).toString()
  );
  flooroptions: string[] = [];
  numberOfBeds: any;
  showSections = false;

  isValidEmail() {
    throw new Error('Method not implemented.');
  }
  // email: any;
  onFormSubmit(_t594: NgForm) {
    throw new Error('Method not implemented.');
  }

  getUniqueTypes() {
    const types = this.propertyType?.map((item: any) => item?.type);
    return [...new Set(types)]; // Get unique types
  }


  getPropertiesByType(type: any) {
    return this.propertyType?.filter((item: any) => item?.type === type);
  }
  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private metaService: Meta,
    private PostpropertyfreeService: PostpropertyfreeService,
    public http: HttpClient,
    private toastr: ToastrService,
    private route: Router,
  ) {
    this.setMetaTags(
      'Sell and Rent Your Property For Free on realtymart',
      '',
    );
    const propertyDataJson = localStorage.getItem('postPropertyData');
    const propertyData = propertyDataJson ? JSON.parse(propertyDataJson) : null;

    if (propertyData) {
      this.submitForm.patchValue({
        property_for: propertyData.property_for || '',
      });
      this.onPropertyFor(propertyData.property_for);
    }
    const tokens = localStorage.getItem('myrealtylogintoken');
    if(tokens === null){
      this.route.navigate(['/login']);
      this.toastr.error('Please Login!');
    } else {
      this.userRoleGet = localStorage.getItem('role');
    }
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

  @HostListener('document:click', ['$event'])
  outsideClick(event: Event) {
    const target = event.target as HTMLElement;

    if (!target.closest('.custom-select')) {
      this.closeAllDropdowns();
    }
  }
  closeAllDropdowns() {
    this.isDropdownOpen = false;
    this.isbalconiDropdownOpen = false;
    this.isbathRoomDropdownOpen = false;
    this.isfloorNoDropdownOpen = false;
    this.isfloorDropdownOpen = false;
  }

  get bedroomsize(): FormArray {
    return this.submitForm.get('bedroomsize') as FormArray;
  }

  initBedrooms() {
    this.bedroomsize.clear();

    for (let i = 0; i < this.numberOfBeds; i++) {
      this.bedroomsize.push(
        this.fb.group({
          bedroom_length: [''],
          bedroom_width: ['']
        })
      );
    }

    this.showSections = true;
  }

  onChange(event: any){
    this.selectedPropertyType = this.submitForm.value?.property_type;

    if (this.selectedPropertyType == 1) {
      // total_no_of_flats
      this.submitForm.get('total_no_of_flats')?.setValidators([Validators.required]);
      this.submitForm.get('total_no_of_flats')?.updateValueAndValidity();

      // lift
      this.submitForm.get('lift')?.setValidators([Validators.required]);
      this.submitForm.get('lift')?.updateValueAndValidity();

      // total_units
      this.submitForm.get('total_units')?.setValidators([Validators.required]);
      this.submitForm.get('total_units')?.updateValueAndValidity();

      // total_towers
      this.submitForm.get('total_towers')?.setValidators([Validators.required]);
      this.submitForm.get('total_towers')?.updateValueAndValidity();

      // water_availability
      this.submitForm.get('water_availability')?.setValidators([Validators.required]);
      this.submitForm.get('water_availability')?.updateValueAndValidity();

      // status_of_electricity
      this.submitForm.get('status_of_electricity')?.setValidators([Validators.required]);
      this.submitForm.get('status_of_electricity')?.updateValueAndValidity();

      // floor_no
      this.submitForm.get('floor_no')?.setValidators([Validators.required]);
      this.submitForm.get('floor_no')?.updateValueAndValidity();

      // total_floor
      this.submitForm.get('total_floor')?.setValidators([Validators.required]);
      this.submitForm.get('total_floor')?.updateValueAndValidity();

      // furnishing_status
      this.submitForm.get('furnishing_status')?.setValidators([Validators.required]);
      this.submitForm.get('furnishing_status')?.updateValueAndValidity();

      // bedroom
      this.submitForm.get('bedroom')?.setValidators([Validators.required]);
      this.submitForm.get('bedroom')?.updateValueAndValidity();

      // bathroom
      this.submitForm.get('bathroom')?.setValidators([Validators.required]);
      this.submitForm.get('bathroom')?.updateValueAndValidity();

      // balconies
      this.submitForm.get('balconies')?.setValidators([Validators.required]);
      this.submitForm.get('balconies')?.updateValueAndValidity();

      // flooring
      this.submitForm.get('flooring')?.setValidators([Validators.required]);
      this.submitForm.get('flooring')?.updateValueAndValidity();

      // facing
      this.submitForm.get('facing')?.setValidators([Validators.required]);
      this.submitForm.get('facing')?.updateValueAndValidity();

      // additional_rooms
      this.submitForm.get('additional_rooms')?.setValidators([Validators.required]);
      this.submitForm.get('additional_rooms')?.updateValueAndValidity();

      // built_up_area
      this.submitForm.get('built_up_area')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area')?.updateValueAndValidity();

      // built_up_area_in
      this.submitForm.get('built_up_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area_in')?.updateValueAndValidity();

      // super_area
      this.submitForm.get('super_area')?.setValidators([Validators.required]);
      this.submitForm.get('super_area')?.updateValueAndValidity();

      // super_area_in
      this.submitForm.get('super_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('super_area_in')?.updateValueAndValidity();

      // carpet_area
      this.submitForm.get('carpet_area')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area')?.updateValueAndValidity();

      // carpet_area_in
      this.submitForm.get('carpet_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area_in')?.updateValueAndValidity();

      // possession_status
      this.submitForm.get('possession_status')?.setValidators([Validators.required]);
      this.submitForm.get('possession_status')?.updateValueAndValidity();

    } else if(this.selectedPropertyType == 3){
      // lift
      this.submitForm.get('lift')?.setValidators([Validators.required]);
      this.submitForm.get('lift')?.updateValueAndValidity();

      // total_units
      this.submitForm.get('total_units')?.setValidators([Validators.required]);
      this.submitForm.get('total_units')?.updateValueAndValidity();

      // total_floor
      this.submitForm.get('total_floor')?.setValidators([Validators.required]);
      this.submitForm.get('total_floor')?.updateValueAndValidity();

      // furnishing_status
      this.submitForm.get('furnishing_status')?.setValidators([Validators.required]);
      this.submitForm.get('furnishing_status')?.updateValueAndValidity();

      // no_of_open_sides
      this.submitForm.get('no_of_open_sides')?.setValidators([Validators.required]);
      this.submitForm.get('no_of_open_sides')?.updateValueAndValidity();

      // width_of_road_facing_the_plot
      this.submitForm.get('width_of_road_facing_the_plot')?.setValidators([Validators.required]);
      this.submitForm.get('width_of_road_facing_the_plot')?.updateValueAndValidity();

      // bedroom
      this.submitForm.get('bedroom')?.setValidators([Validators.required]);
      this.submitForm.get('bedroom')?.updateValueAndValidity();

      // bathroom
      this.submitForm.get('bathroom')?.setValidators([Validators.required]);
      this.submitForm.get('bathroom')?.updateValueAndValidity();

      // built_up_area
      this.submitForm.get('built_up_area')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area')?.updateValueAndValidity();

      // built_up_area_in
      this.submitForm.get('built_up_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area_in')?.updateValueAndValidity();

      // carpet_area
      this.submitForm.get('carpet_area')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area')?.updateValueAndValidity();

      // carpet_area_in
      this.submitForm.get('carpet_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area_in')?.updateValueAndValidity();

      // covered_area
      this.submitForm.get('covered_area')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area')?.updateValueAndValidity();

      // covered_area_in
      this.submitForm.get('covered_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area_in')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // plot_length
      this.submitForm.get('plot_length')?.setValidators([Validators.required]);
      this.submitForm.get('plot_length')?.updateValueAndValidity();

      // plot_width
      this.submitForm.get('plot_width')?.setValidators([Validators.required]);
      this.submitForm.get('plot_width')?.updateValueAndValidity();

      // possession_status
      this.submitForm.get('possession_status')?.setValidators([Validators.required]);
      this.submitForm.get('possession_status')?.updateValueAndValidity();

    } else if(this.selectedPropertyType == 4){
      // land_zone
      this.submitForm.get('land_zone')?.setValidators([Validators.required]);
      this.submitForm.get('land_zone')?.updateValueAndValidity();

      // lift
      this.submitForm.get('lift')?.setValidators([Validators.required]);
      this.submitForm.get('lift')?.updateValueAndValidity();

      // total_floor
      this.submitForm.get('total_floor')?.setValidators([Validators.required]);
      this.submitForm.get('total_floor')?.updateValueAndValidity();

      // furnishing_status
      this.submitForm.get('furnishing_status')?.setValidators([Validators.required]);
      this.submitForm.get('furnishing_status')?.updateValueAndValidity();

      // no_of_open_sides
      this.submitForm.get('no_of_open_sides')?.setValidators([Validators.required]);
      this.submitForm.get('no_of_open_sides')?.updateValueAndValidity();

      // width_of_road_facing_the_plot
      this.submitForm.get('width_of_road_facing_the_plot')?.setValidators([Validators.required]);
      this.submitForm.get('width_of_road_facing_the_plot')?.updateValueAndValidity();

      // bedroom
      this.submitForm.get('bedroom')?.setValidators([Validators.required]);
      this.submitForm.get('bedroom')?.updateValueAndValidity();

      // bathroom
      this.submitForm.get('bathroom')?.setValidators([Validators.required]);
      this.submitForm.get('bathroom')?.updateValueAndValidity();

      // built_up_area
      this.submitForm.get('built_up_area')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area')?.updateValueAndValidity();

      // built_up_area_in
      this.submitForm.get('built_up_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area_in')?.updateValueAndValidity();

      // carpet_area
      this.submitForm.get('carpet_area')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area')?.updateValueAndValidity();

      // carpet_area_in
      this.submitForm.get('carpet_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area_in')?.updateValueAndValidity();

      // covered_area
      this.submitForm.get('covered_area')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area')?.updateValueAndValidity();

      // covered_area_in
      this.submitForm.get('covered_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area_in')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // plot_length
      this.submitForm.get('plot_length')?.setValidators([Validators.required]);
      this.submitForm.get('plot_length')?.updateValueAndValidity();

      // plot_width
      this.submitForm.get('plot_width')?.setValidators([Validators.required]);
      this.submitForm.get('plot_width')?.updateValueAndValidity();

      // possession_status
      this.submitForm.get('possession_status')?.setValidators([Validators.required]);
      this.submitForm.get('possession_status')?.updateValueAndValidity();

    } else if(this.selectedPropertyType == 5){
      // land_zone
      this.submitForm.get('land_zone')?.setValidators([Validators.required]);
      this.submitForm.get('land_zone')?.updateValueAndValidity();

      // no_of_open_sides
      this.submitForm.get('no_of_open_sides')?.setValidators([Validators.required]);
      this.submitForm.get('no_of_open_sides')?.updateValueAndValidity();

      // width_of_road_facing_the_plot
      this.submitForm.get('width_of_road_facing_the_plot')?.setValidators([Validators.required]);
      this.submitForm.get('width_of_road_facing_the_plot')?.updateValueAndValidity();

      // floors_allowed_for_construction
      this.submitForm.get('floors_allowed_for_construction')?.setValidators([Validators.required]);
      this.submitForm.get('floors_allowed_for_construction')?.updateValueAndValidity();

      // boundary_wall_made
      this.submitForm.get('boundary_wall_made')?.setValidators([Validators.required]);
      this.submitForm.get('boundary_wall_made')?.updateValueAndValidity();

      // is_in_gated_colony
      this.submitForm.get('is_in_gated_colony')?.setValidators([Validators.required]);
      this.submitForm.get('is_in_gated_colony')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // plot_length
      this.submitForm.get('plot_length')?.setValidators([Validators.required]);
      this.submitForm.get('plot_length')?.updateValueAndValidity();

      // plot_width
      this.submitForm.get('plot_width')?.setValidators([Validators.required]);
      this.submitForm.get('plot_width')?.updateValueAndValidity();

    } else if(this.selectedPropertyType == 8){
      // land_zone
      this.submitForm.get('land_zone')?.setValidators([Validators.required]);
      this.submitForm.get('land_zone')?.updateValueAndValidity();

      // lift
      this.submitForm.get('lift')?.setValidators([Validators.required]);
      this.submitForm.get('lift')?.updateValueAndValidity();

      // total_units
      this.submitForm.get('total_units')?.setValidators([Validators.required]);
      this.submitForm.get('total_units')?.updateValueAndValidity();

      // total_towers
      this.submitForm.get('total_towers')?.setValidators([Validators.required]);
      this.submitForm.get('total_towers')?.updateValueAndValidity();

      // water_availability
      this.submitForm.get('water_availability')?.setValidators([Validators.required]);
      this.submitForm.get('water_availability')?.updateValueAndValidity();

      // status_of_electricity
      this.submitForm.get('status_of_electricity')?.setValidators([Validators.required]);
      this.submitForm.get('status_of_electricity')?.updateValueAndValidity();

      // floor_no
      this.submitForm.get('floor_no')?.setValidators([Validators.required]);
      this.submitForm.get('floor_no')?.updateValueAndValidity();

      // total_floor
      this.submitForm.get('total_floor')?.setValidators([Validators.required]);
      this.submitForm.get('total_floor')?.updateValueAndValidity();

      // furnishing_status
      this.submitForm.get('furnishing_status')?.setValidators([Validators.required]);
      this.submitForm.get('furnishing_status')?.updateValueAndValidity();

      // washroom
      this.submitForm.get('washroom')?.setValidators([Validators.required]);
      this.submitForm.get('washroom')?.updateValueAndValidity();

      // personal_washroom
      this.submitForm.get('personal_washroom')?.setValidators([Validators.required]);
      this.submitForm.get('personal_washroom')?.updateValueAndValidity();

      // pantry_cafeteria
      this.submitForm.get('pantry_cafeteria')?.setValidators([Validators.required]);
      this.submitForm.get('pantry_cafeteria')?.updateValueAndValidity();

      // built_up_area
      this.submitForm.get('built_up_area')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area')?.updateValueAndValidity();

      // built_up_area_in
      this.submitForm.get('built_up_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area_in')?.updateValueAndValidity();

      // carpet_area
      this.submitForm.get('carpet_area')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area')?.updateValueAndValidity();

      // carpet_area_in
      this.submitForm.get('carpet_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area_in')?.updateValueAndValidity();

      // covered_area
      this.submitForm.get('covered_area')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area')?.updateValueAndValidity();

      // covered_area_in
      this.submitForm.get('covered_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area_in')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // possession_status
      this.submitForm.get('possession_status')?.setValidators([Validators.required]);
      this.submitForm.get('possession_status')?.updateValueAndValidity();

    } else if(this.selectedPropertyType == 9){
      // land_zone
      this.submitForm.get('land_zone')?.setValidators([Validators.required]);
      this.submitForm.get('land_zone')?.updateValueAndValidity();

      // no_of_open_sides
      this.submitForm.get('no_of_open_sides')?.setValidators([Validators.required]);
      this.submitForm.get('no_of_open_sides')?.updateValueAndValidity();

      // width_of_road_facing_the_plot
      this.submitForm.get('width_of_road_facing_the_plot')?.setValidators([Validators.required]);
      this.submitForm.get('width_of_road_facing_the_plot')?.updateValueAndValidity();

      // floors_allowed_for_construction
      this.submitForm.get('floors_allowed_for_construction')?.setValidators([Validators.required]);
      this.submitForm.get('floors_allowed_for_construction')?.updateValueAndValidity();

      // boundary_wall_made
      this.submitForm.get('boundary_wall_made')?.setValidators([Validators.required]);
      this.submitForm.get('boundary_wall_made')?.updateValueAndValidity();

      // is_in_gated_colony
      this.submitForm.get('is_in_gated_colony')?.setValidators([Validators.required]);
      this.submitForm.get('is_in_gated_colony')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // plot_length
      this.submitForm.get('plot_length')?.setValidators([Validators.required]);
      this.submitForm.get('plot_length')?.updateValueAndValidity();

      // plot_width
      this.submitForm.get('plot_width')?.setValidators([Validators.required]);
      this.submitForm.get('plot_width')?.updateValueAndValidity();

    } else if(this.selectedPropertyType == 10){
      // lift
      this.submitForm.get('lift')?.setValidators([Validators.required]);
      this.submitForm.get('lift')?.updateValueAndValidity();

      // total_units
      this.submitForm.get('total_units')?.setValidators([Validators.required]);
      this.submitForm.get('total_units')?.updateValueAndValidity();

      // total_towers
      this.submitForm.get('total_towers')?.setValidators([Validators.required]);
      this.submitForm.get('total_towers')?.updateValueAndValidity();

      // water_availability
      this.submitForm.get('water_availability')?.setValidators([Validators.required]);
      this.submitForm.get('water_availability')?.updateValueAndValidity();

      // status_of_electricity
      this.submitForm.get('status_of_electricity')?.setValidators([Validators.required]);
      this.submitForm.get('status_of_electricity')?.updateValueAndValidity();

      // floor_no
      this.submitForm.get('floor_no')?.setValidators([Validators.required]);
      this.submitForm.get('floor_no')?.updateValueAndValidity();

      // total_floor
      this.submitForm.get('total_floor')?.setValidators([Validators.required]);
      this.submitForm.get('total_floor')?.updateValueAndValidity();

      // furnishing_status
      this.submitForm.get('furnishing_status')?.setValidators([Validators.required]);
      this.submitForm.get('furnishing_status')?.updateValueAndValidity();

      // bedroom
      this.submitForm.get('bedroom')?.setValidators([Validators.required]);
      this.submitForm.get('bedroom')?.updateValueAndValidity();

      // bathroom
      this.submitForm.get('bathroom')?.setValidators([Validators.required]);
      this.submitForm.get('bathroom')?.updateValueAndValidity();

      // balconies
      this.submitForm.get('balconies')?.setValidators([Validators.required]);
      this.submitForm.get('balconies')?.updateValueAndValidity();

      // flooring
      this.submitForm.get('flooring')?.setValidators([Validators.required]);
      this.submitForm.get('flooring')?.updateValueAndValidity();

      // facing
      this.submitForm.get('facing')?.setValidators([Validators.required]);
      this.submitForm.get('facing')?.updateValueAndValidity();

      // additional_rooms
      this.submitForm.get('additional_rooms')?.setValidators([Validators.required]);
      this.submitForm.get('additional_rooms')?.updateValueAndValidity();

      // built_up_area
      this.submitForm.get('built_up_area')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area')?.updateValueAndValidity();

      // built_up_area_in
      this.submitForm.get('built_up_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area_in')?.updateValueAndValidity();

      // carpet_area
      this.submitForm.get('carpet_area')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area')?.updateValueAndValidity();

      // carpet_area_in
      this.submitForm.get('carpet_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area_in')?.updateValueAndValidity();

      // covered_area
      this.submitForm.get('covered_area')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area')?.updateValueAndValidity();

      // covered_area_in
      this.submitForm.get('covered_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area_in')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // possession_status
      this.submitForm.get('possession_status')?.setValidators([Validators.required]);
      this.submitForm.get('possession_status')?.updateValueAndValidity();

    } else if(this.selectedPropertyType == 11){
      // lift
      this.submitForm.get('lift')?.setValidators([Validators.required]);
      this.submitForm.get('lift')?.updateValueAndValidity();

      // total_floor
      this.submitForm.get('total_floor')?.setValidators([Validators.required]);
      this.submitForm.get('total_floor')?.updateValueAndValidity();

      // furnishing_status
      this.submitForm.get('furnishing_status')?.setValidators([Validators.required]);
      this.submitForm.get('furnishing_status')?.updateValueAndValidity();

      // bedroom
      this.submitForm.get('bedroom')?.setValidators([Validators.required]);
      this.submitForm.get('bedroom')?.updateValueAndValidity();

      // bathroom
      this.submitForm.get('bathroom')?.setValidators([Validators.required]);
      this.submitForm.get('bathroom')?.updateValueAndValidity();

      // built_up_area
      this.submitForm.get('built_up_area')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area')?.updateValueAndValidity();

      // built_up_area_in
      this.submitForm.get('built_up_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area_in')?.updateValueAndValidity();

      // carpet_area
      this.submitForm.get('carpet_area')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area')?.updateValueAndValidity();

      // carpet_area_in
      this.submitForm.get('carpet_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area_in')?.updateValueAndValidity();

      // covered_area
      this.submitForm.get('covered_area')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area')?.updateValueAndValidity();

      // covered_area_in
      this.submitForm.get('covered_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area_in')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // plot_length
      this.submitForm.get('plot_length')?.setValidators([Validators.required]);
      this.submitForm.get('plot_length')?.updateValueAndValidity();

      // plot_width
      this.submitForm.get('plot_width')?.setValidators([Validators.required]);
      this.submitForm.get('plot_width')?.updateValueAndValidity();

      // possession_status
      this.submitForm.get('possession_status')?.setValidators([Validators.required]);
      this.submitForm.get('possession_status')?.updateValueAndValidity();

    } else if(this.selectedPropertyType == 12){
      // lift
      this.submitForm.get('lift')?.setValidators([Validators.required]);
      this.submitForm.get('lift')?.updateValueAndValidity();

      // total_units
      this.submitForm.get('total_units')?.setValidators([Validators.required]);
      this.submitForm.get('total_units')?.updateValueAndValidity();

      // total_towers
      this.submitForm.get('total_towers')?.setValidators([Validators.required]);
      this.submitForm.get('total_towers')?.updateValueAndValidity();

      // water_availability
      this.submitForm.get('water_availability')?.setValidators([Validators.required]);
      this.submitForm.get('water_availability')?.updateValueAndValidity();

      // status_of_electricity
      this.submitForm.get('status_of_electricity')?.setValidators([Validators.required]);
      this.submitForm.get('status_of_electricity')?.updateValueAndValidity();

      // floor_no
      this.submitForm.get('floor_no')?.setValidators([Validators.required]);
      this.submitForm.get('floor_no')?.updateValueAndValidity();

      // total_floor
      this.submitForm.get('total_floor')?.setValidators([Validators.required]);
      this.submitForm.get('total_floor')?.updateValueAndValidity();

      // furnishing_status
      this.submitForm.get('furnishing_status')?.setValidators([Validators.required]);
      this.submitForm.get('furnishing_status')?.updateValueAndValidity();

      // bedroom
      this.submitForm.get('bedroom')?.setValidators([Validators.required]);
      this.submitForm.get('bedroom')?.updateValueAndValidity();

      // bathroom
      this.submitForm.get('bathroom')?.setValidators([Validators.required]);
      this.submitForm.get('bathroom')?.updateValueAndValidity();

      // balconies
      this.submitForm.get('balconies')?.setValidators([Validators.required]);
      this.submitForm.get('balconies')?.updateValueAndValidity();

      // flooring
      this.submitForm.get('flooring')?.setValidators([Validators.required]);
      this.submitForm.get('flooring')?.updateValueAndValidity();

      // facing
      this.submitForm.get('facing')?.setValidators([Validators.required]);
      this.submitForm.get('facing')?.updateValueAndValidity();

      // additional_rooms
      this.submitForm.get('additional_rooms')?.setValidators([Validators.required]);
      this.submitForm.get('additional_rooms')?.updateValueAndValidity();

      // built_up_area
      this.submitForm.get('built_up_area')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area')?.updateValueAndValidity();

      // built_up_area_in
      this.submitForm.get('built_up_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area_in')?.updateValueAndValidity();

      // carpet_area
      this.submitForm.get('carpet_area')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area')?.updateValueAndValidity();

      // carpet_area_in
      this.submitForm.get('carpet_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area_in')?.updateValueAndValidity();

      // covered_area
      this.submitForm.get('covered_area')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area')?.updateValueAndValidity();

      // covered_area_in
      this.submitForm.get('covered_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area_in')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // possession_status
      this.submitForm.get('possession_status')?.setValidators([Validators.required]);
      this.submitForm.get('possession_status')?.updateValueAndValidity();

    } else if(this.selectedPropertyType == 16){
      // land_zone
      this.submitForm.get('land_zone')?.setValidators([Validators.required]);
      this.submitForm.get('land_zone')?.updateValueAndValidity();

      // lift
      this.submitForm.get('lift')?.setValidators([Validators.required]);
      this.submitForm.get('lift')?.updateValueAndValidity();

      // total_units
      this.submitForm.get('total_units')?.setValidators([Validators.required]);
      this.submitForm.get('total_units')?.updateValueAndValidity();

      // total_towers
      this.submitForm.get('total_towers')?.setValidators([Validators.required]);
      this.submitForm.get('total_towers')?.updateValueAndValidity();

      // water_availability
      this.submitForm.get('water_availability')?.setValidators([Validators.required]);
      this.submitForm.get('water_availability')?.updateValueAndValidity();

      // status_of_electricity
      this.submitForm.get('status_of_electricity')?.setValidators([Validators.required]);
      this.submitForm.get('status_of_electricity')?.updateValueAndValidity();

      // floor_no
      this.submitForm.get('floor_no')?.setValidators([Validators.required]);
      this.submitForm.get('floor_no')?.updateValueAndValidity();

      // total_floor
      this.submitForm.get('total_floor')?.setValidators([Validators.required]);
      this.submitForm.get('total_floor')?.updateValueAndValidity();

      // furnishing_status
      this.submitForm.get('furnishing_status')?.setValidators([Validators.required]);
      this.submitForm.get('furnishing_status')?.updateValueAndValidity();

      // washroom
      this.submitForm.get('washroom')?.setValidators([Validators.required]);
      this.submitForm.get('washroom')?.updateValueAndValidity();

      // personal_washroom
      this.submitForm.get('personal_washroom')?.setValidators([Validators.required]);
      this.submitForm.get('personal_washroom')?.updateValueAndValidity();

      // pantry_cafeteria
      this.submitForm.get('pantry_cafeteria')?.setValidators([Validators.required]);
      this.submitForm.get('pantry_cafeteria')?.updateValueAndValidity();

      // built_up_area
      this.submitForm.get('built_up_area')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area')?.updateValueAndValidity();

      // built_up_area_in
      this.submitForm.get('built_up_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area_in')?.updateValueAndValidity();

      // covered_area
      this.submitForm.get('covered_area')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area')?.updateValueAndValidity();

      // covered_area_in
      this.submitForm.get('covered_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area_in')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // possession_status
      this.submitForm.get('possession_status')?.setValidators([Validators.required]);
      this.submitForm.get('possession_status')?.updateValueAndValidity();

    } else if(this.selectedPropertyType == 17){
      // land_zone
      this.submitForm.get('land_zone')?.setValidators([Validators.required]);
      this.submitForm.get('land_zone')?.updateValueAndValidity();

      // floors_allowed_for_construction
      this.submitForm.get('floors_allowed_for_construction')?.setValidators([Validators.required]);
      this.submitForm.get('floors_allowed_for_construction')?.updateValueAndValidity();

      // boundary_wall_made
      this.submitForm.get('boundary_wall_made')?.setValidators([Validators.required]);
      this.submitForm.get('boundary_wall_made')?.updateValueAndValidity();

      // is_in_gated_colony
      this.submitForm.get('is_in_gated_colony')?.setValidators([Validators.required]);
      this.submitForm.get('is_in_gated_colony')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // plot_length
      this.submitForm.get('plot_length')?.setValidators([Validators.required]);
      this.submitForm.get('plot_length')?.updateValueAndValidity();

      // plot_width
      this.submitForm.get('plot_width')?.setValidators([Validators.required]);
      this.submitForm.get('plot_width')?.updateValueAndValidity();

    } else if(this.selectedPropertyType == 18){
      // land_zone
      this.submitForm.get('land_zone')?.setValidators([Validators.required]);
      this.submitForm.get('land_zone')?.updateValueAndValidity();

      // lift
      this.submitForm.get('lift')?.setValidators([Validators.required]);
      this.submitForm.get('lift')?.updateValueAndValidity();

      // total_units
      this.submitForm.get('total_units')?.setValidators([Validators.required]);
      this.submitForm.get('total_units')?.updateValueAndValidity();

      // total_towers
      this.submitForm.get('total_towers')?.setValidators([Validators.required]);
      this.submitForm.get('total_towers')?.updateValueAndValidity();

      // water_availability
      this.submitForm.get('water_availability')?.setValidators([Validators.required]);
      this.submitForm.get('water_availability')?.updateValueAndValidity();

      // status_of_electricity
      this.submitForm.get('status_of_electricity')?.setValidators([Validators.required]);
      this.submitForm.get('status_of_electricity')?.updateValueAndValidity();

      // floor_no
      this.submitForm.get('floor_no')?.setValidators([Validators.required]);
      this.submitForm.get('floor_no')?.updateValueAndValidity();

      // total_floor
      this.submitForm.get('total_floor')?.setValidators([Validators.required]);
      this.submitForm.get('total_floor')?.updateValueAndValidity();

      // furnishing_status
      this.submitForm.get('furnishing_status')?.setValidators([Validators.required]);
      this.submitForm.get('furnishing_status')?.updateValueAndValidity();

      // washroom
      this.submitForm.get('washroom')?.setValidators([Validators.required]);
      this.submitForm.get('washroom')?.updateValueAndValidity();

      // personal_washroom
      this.submitForm.get('personal_washroom')?.setValidators([Validators.required]);
      this.submitForm.get('personal_washroom')?.updateValueAndValidity();

      // pantry_cafeteria
      this.submitForm.get('pantry_cafeteria')?.setValidators([Validators.required]);
      this.submitForm.get('pantry_cafeteria')?.updateValueAndValidity();

      // built_up_area
      this.submitForm.get('built_up_area')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area')?.updateValueAndValidity();

      // built_up_area_in
      this.submitForm.get('built_up_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area_in')?.updateValueAndValidity();

      // carpet_area
      this.submitForm.get('carpet_area')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area')?.updateValueAndValidity();

      // carpet_area_in
      this.submitForm.get('carpet_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area_in')?.updateValueAndValidity();

      // covered_area
      this.submitForm.get('covered_area')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area')?.updateValueAndValidity();

      // covered_area_in
      this.submitForm.get('covered_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area_in')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // possession_status
      this.submitForm.get('possession_status')?.setValidators([Validators.required]);
      this.submitForm.get('possession_status')?.updateValueAndValidity();

    } else if(this.selectedPropertyType == 19){
      // land_zone
      this.submitForm.get('land_zone')?.setValidators([Validators.required]);
      this.submitForm.get('land_zone')?.updateValueAndValidity();

      // lift
      this.submitForm.get('lift')?.setValidators([Validators.required]);
      this.submitForm.get('lift')?.updateValueAndValidity();

      // total_units
      this.submitForm.get('total_units')?.setValidators([Validators.required]);
      this.submitForm.get('total_units')?.updateValueAndValidity();

      // total_towers
      this.submitForm.get('total_towers')?.setValidators([Validators.required]);
      this.submitForm.get('total_towers')?.updateValueAndValidity();

      // water_availability
      this.submitForm.get('water_availability')?.setValidators([Validators.required]);
      this.submitForm.get('water_availability')?.updateValueAndValidity();

      // status_of_electricity
      this.submitForm.get('status_of_electricity')?.setValidators([Validators.required]);
      this.submitForm.get('status_of_electricity')?.updateValueAndValidity();

      // floor_no
      this.submitForm.get('floor_no')?.setValidators([Validators.required]);
      this.submitForm.get('floor_no')?.updateValueAndValidity();

      // total_floor
      this.submitForm.get('total_floor')?.setValidators([Validators.required]);
      this.submitForm.get('total_floor')?.updateValueAndValidity();

      // furnishing_status
      this.submitForm.get('furnishing_status')?.setValidators([Validators.required]);
      this.submitForm.get('furnishing_status')?.updateValueAndValidity();

      // washroom
      this.submitForm.get('washroom')?.setValidators([Validators.required]);
      this.submitForm.get('washroom')?.updateValueAndValidity();

      // personal_washroom
      this.submitForm.get('personal_washroom')?.setValidators([Validators.required]);
      this.submitForm.get('personal_washroom')?.updateValueAndValidity();

      // pantry_cafeteria
      this.submitForm.get('pantry_cafeteria')?.setValidators([Validators.required]);
      this.submitForm.get('pantry_cafeteria')?.updateValueAndValidity();

      // built_up_area
      this.submitForm.get('built_up_area')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area')?.updateValueAndValidity();

      // built_up_area_in
      this.submitForm.get('built_up_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area_in')?.updateValueAndValidity();

      // carpet_area
      this.submitForm.get('carpet_area')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area')?.updateValueAndValidity();

      // carpet_area_in
      this.submitForm.get('carpet_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('carpet_area_in')?.updateValueAndValidity();

      // covered_area
      this.submitForm.get('covered_area')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area')?.updateValueAndValidity();

      // covered_area_in
      this.submitForm.get('covered_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area_in')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // possession_status
      this.submitForm.get('possession_status')?.setValidators([Validators.required]);
      this.submitForm.get('possession_status')?.updateValueAndValidity();

    } else if(this.selectedPropertyType == 20){
      // land_zone
      this.submitForm.get('land_zone')?.setValidators([Validators.required]);
      this.submitForm.get('land_zone')?.updateValueAndValidity();

      // lift
      this.submitForm.get('lift')?.setValidators([Validators.required]);
      this.submitForm.get('lift')?.updateValueAndValidity();

      // total_units
      this.submitForm.get('total_units')?.setValidators([Validators.required]);
      this.submitForm.get('total_units')?.updateValueAndValidity();

      // total_towers
      this.submitForm.get('total_towers')?.setValidators([Validators.required]);
      this.submitForm.get('total_towers')?.updateValueAndValidity();

      // water_availability
      this.submitForm.get('water_availability')?.setValidators([Validators.required]);
      this.submitForm.get('water_availability')?.updateValueAndValidity();

      // status_of_electricity
      this.submitForm.get('status_of_electricity')?.setValidators([Validators.required]);
      this.submitForm.get('status_of_electricity')?.updateValueAndValidity();

      // floor_no
      this.submitForm.get('floor_no')?.setValidators([Validators.required]);
      this.submitForm.get('floor_no')?.updateValueAndValidity();

      // total_floor
      this.submitForm.get('total_floor')?.setValidators([Validators.required]);
      this.submitForm.get('total_floor')?.updateValueAndValidity();

      // furnishing_status
      this.submitForm.get('furnishing_status')?.setValidators([Validators.required]);
      this.submitForm.get('furnishing_status')?.updateValueAndValidity();

      // furnishing_status
      this.submitForm.get('furnishing_status')?.setValidators([Validators.required]);
      this.submitForm.get('furnishing_status')?.updateValueAndValidity();

      // washroom
      this.submitForm.get('washroom')?.setValidators([Validators.required]);
      this.submitForm.get('washroom')?.updateValueAndValidity();

      // personal_washroom
      this.submitForm.get('personal_washroom')?.setValidators([Validators.required]);
      this.submitForm.get('personal_washroom')?.updateValueAndValidity();

      // pantry_cafeteria
      this.submitForm.get('pantry_cafeteria')?.setValidators([Validators.required]);
      this.submitForm.get('pantry_cafeteria')?.updateValueAndValidity();

      // built_up_area
      this.submitForm.get('built_up_area')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area')?.updateValueAndValidity();

      // built_up_area_in
      this.submitForm.get('built_up_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('built_up_area_in')?.updateValueAndValidity();

      // covered_area
      this.submitForm.get('covered_area')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area')?.updateValueAndValidity();

      // covered_area_in
      this.submitForm.get('covered_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('covered_area_in')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // plot_length
      this.submitForm.get('plot_length')?.setValidators([Validators.required]);
      this.submitForm.get('plot_length')?.updateValueAndValidity();

      // plot_width
      this.submitForm.get('plot_width')?.setValidators([Validators.required]);
      this.submitForm.get('plot_width')?.updateValueAndValidity();

      // possession_status
      this.submitForm.get('possession_status')?.setValidators([Validators.required]);
      this.submitForm.get('possession_status')?.updateValueAndValidity();

    } else if(this.selectedPropertyType == 21){
      // land_zone
      this.submitForm.get('land_zone')?.setValidators([Validators.required]);
      this.submitForm.get('land_zone')?.updateValueAndValidity();

      // no_of_open_sides
      this.submitForm.get('no_of_open_sides')?.setValidators([Validators.required]);
      this.submitForm.get('no_of_open_sides')?.updateValueAndValidity();

      // width_of_road_facing_the_plot
      this.submitForm.get('width_of_road_facing_the_plot')?.setValidators([Validators.required]);
      this.submitForm.get('width_of_road_facing_the_plot')?.updateValueAndValidity();

      // floors_allowed_for_construction
      this.submitForm.get('floors_allowed_for_construction')?.setValidators([Validators.required]);
      this.submitForm.get('floors_allowed_for_construction')?.updateValueAndValidity();

      // boundary_wall_made
      this.submitForm.get('boundary_wall_made')?.setValidators([Validators.required]);
      this.submitForm.get('boundary_wall_made')?.updateValueAndValidity();

      // is_in_gated_colony
      this.submitForm.get('is_in_gated_colony')?.setValidators([Validators.required]);
      this.submitForm.get('is_in_gated_colony')?.updateValueAndValidity();

      // ploat_area
      this.submitForm.get('ploat_area')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area')?.updateValueAndValidity();

      // ploat_area_in
      this.submitForm.get('ploat_area_in')?.setValidators([Validators.required]);
      this.submitForm.get('ploat_area_in')?.updateValueAndValidity();

      // plot_length
      this.submitForm.get('plot_length')?.setValidators([Validators.required]);
      this.submitForm.get('plot_length')?.updateValueAndValidity();

      // plot_width
      this.submitForm.get('plot_width')?.setValidators([Validators.required]);
      this.submitForm.get('plot_width')?.updateValueAndValidity();

    }
  }

  onPropertyFor(event: Event) {
    this.selectedPropertyFor = this.submitForm.value?.property_for;

    if(this.selectedPropertyFor == 'Rent'){
      // avbldate
      this.submitForm.get('avbldate')?.setValidators([Validators.required]);
      this.submitForm.get('avbldate')?.updateValueAndValidity();

      // available_from
      this.submitForm.get('available_from')?.setValidators([Validators.required]);
      this.submitForm.get('available_from')?.updateValueAndValidity();

      // rent_amount
      this.submitForm.get('rent_amount')?.setValidators([Validators.required]);
      this.submitForm.get('rent_amount')?.updateValueAndValidity();

      // security_amount
      this.submitForm.get('security_amount')?.setValidators([Validators.required]);
      this.submitForm.get('security_amount')?.updateValueAndValidity();

    } else if(this.selectedPropertyFor == 'Sell'){
      // total_price
      this.submitForm.get('total_price')?.setValidators([Validators.required]);
      this.submitForm.get('total_price')?.updateValueAndValidity();

      // lac_or_cr
      this.submitForm.get('lac_or_cr')?.setValidators([Validators.required]);
      this.submitForm.get('lac_or_cr')?.updateValueAndValidity();

      // booking_or_token_ammount
      this.submitForm.get('booking_or_token_ammount')?.setValidators([Validators.required]);
      this.submitForm.get('booking_or_token_ammount')?.updateValueAndValidity();

      // thousand_lac_or_cr
      this.submitForm.get('thousand_lac_or_cr')?.setValidators([Validators.required]);
      this.submitForm.get('thousand_lac_or_cr')?.updateValueAndValidity();
    }
  }

  showpossessionstatus(){
    this.selectedPossessionStatus = this.submitForm.value?.possession_status;
    console.log(this.selectedPossessionStatus);

    if(this.selectedPropertyFor !== 'Rent' || this.selectedPossessionStatus == 'Under Construction'){
      // available_from_month
      this.submitForm.get('available_from_month')?.setValidators([Validators.required]);
      this.submitForm.get('available_from_month')?.updateValueAndValidity();

      // available_from_year
      this.submitForm.get('available_from_year')?.setValidators([Validators.required]);
      this.submitForm.get('available_from_year')?.updateValueAndValidity();

    }
  }

  ageofconstruction(){
    this.selectedAgeOfConstruction = this.submitForm.value?.age_of_construction;
  }

  currentbusinesssector(){
    this.selectedCurrentBusinessSector = this.submitForm.value?.current_business_sector;
  }

  ontransactiontype(){
    this.selectedTransactionType = this.submitForm.value?.transaction_type;
  }

  onAssuredReturns(){
    this.selectedAssuredReturns = this.submitForm.value?.assured_returns;
  }

  ngOnInit() {
    this.fetchPropertyType();
    this.fetchLandZone();
    this.fetchBusinesssector();
    this.fetchCities();
    this.flooroptions = this.flooroptions.concat(
      Array.from({ length: 185 }, (_, i) => (i + 16).toString())
    );
    const currentYear = new Date().getFullYear();
    const endYear = currentYear + 10;
    this.availableYears = Array.from({ length: endYear - currentYear + 1 }, (_, i) => currentYear + i);
    const startYear = 1910;
    this.businessYears = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);
  }

  fetchPropertyType() {
    const propertyName = '';
    this.PostpropertyfreeService.getpostPropertyFree().subscribe(
      (res: any) => {
        this.propertyType = res.data;
      },
      (error: any) => {
        console.error('Error fetching post free:', error);
      }
    );
  }
  furnishData = false;

  selectFurnishType(type: string) {
    this.selectedFurnishType = type;
    this.submitForm.patchValue({ furnishing_status: this.selectedFurnishType });
    if (type === 'Furnished' || type === 'Semi-Furnished') {
      this.furnishData = true;
    } else {
      this.furnishData = false;
    }
  }
  selectFlatSociety(societyRange: string): void {
    this.selectedFlatSociety = societyRange;
    this.submitForm.patchValue({ total_no_of_flats: this.selectedFlatSociety });
  }

  onSelectionChange(): void {
    this.selectedAvailabaleDate = this.submitForm.value?.avbldate;
  }

  onLeased(){
    this.isLeased = this.submitForm.value?.currently_leased_out;
  }

  totalandcompletePrice(){
    this.totalcompletePrice = this.submitForm.value?.cmpltprice;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  balconiesDropdown() {
    this.isbalconiDropdownOpen = !this.isbalconiDropdownOpen;
  }
  floortoggleDropdown() {
    this.isfloorDropdownOpen = !this.isfloorDropdownOpen;
  }
  floorNotoggleDropdown() {
    this.isfloorNoDropdownOpen = !this.isfloorNoDropdownOpen;
  }
  bathRoomDropdown() {
    this.isbathRoomDropdownOpen = !this.isbathRoomDropdownOpen;
  }
  selectOption(option: string) {
    this.selectedValue = option;
    this.submitForm.patchValue({ bedroom: this.selectedValue });
    this.isDropdownOpen = this.isDropdownOpen;
    this.showSection = true;
    this.selectedOption = option;
    this.selectedBedRoom = null;

    const num = parseInt(option, 10);
    this.numberOfBed = Array(num)
      .fill(0)
      .map((_, index) => index + 1);
  }

  selectBathRooms(num: any, name: any) {
    this.selectedBathRoom = num;
    this.submitForm.patchValue({ bathroom: this.selectedBathRoom });
    this.selectedBathRoomOption = null;
    this.showBathRoomSection = true;
    this.selectBathRoomsValue = '3+';
  }

  selectFloor(num: any, name: any) {
    this.selectedFloor = num;
    this.selectedFloorOption = null;
    this.showFloorSection = true;
    this.floorNoselectedValue = '5+';
    this.submitForm.patchValue({ floor_no: this.selectedFloor });
  }

  selectFloorOption(floorNoOptions: any) {
    this.floorNoselectedValue = floorNoOptions;
    this.submitForm.patchValue({ floor_no: this.floorNoselectedValue });
    this.selectedFloorOption = floorNoOptions;
    this.selectedFloor = null;
    this.showFloorSection = true;
    this.isfloorNoDropdownOpen = this.isfloorNoDropdownOpen;
  }

  selectTotalFloorDropdownOption(foption: string) {
    this.totalFloorselectedValue = foption;
    this.submitForm.patchValue({ total_floor: this.totalFloorselectedValue });
    this.selectedTotalFloorOption = foption;
    this.selectedTotalFloor = null;
    this.isfloorDropdownOpen = false;
    this.isfloorDropdownOpen = !this.isfloorDropdownOpen;
  }
  selectTotalFloor(num: number) {
    this.selectedTotalFloor = num;
    this.submitForm.patchValue({ total_floor: this.selectedTotalFloor });
    this.selectedTotalFloorOption = null;
    // this.totalFloorselectedValue = num.toString();
    this.totalFloorselectedValue = '15+';
  }
  selectBathRoomOption(bathRoomoptions: string) {
    this.selectBathRoomsValue = bathRoomoptions;
    this.submitForm.patchValue({ bathroom: this.selectBathRoomsValue });
    this.selectedBathRoomOption = bathRoomoptions;
    this.selectedBathRoom = null;
    this.showBathRoomSection = true;
    this.isbathRoomDropdownOpen = this.isbathRoomDropdownOpen;
  }
  selectBalconies(num: any, name: any) {
    this.selectedBalcony = num;
    this.submitForm.patchValue({ balconies: this.selectedBalcony });
    this.selectedBalconiesOption = null;
    this.showBalconySection = true;
    this.selectedBalconiesValue = '3+';
  }
  selectBedRoom(num: any, name: any) {
    this.numberOfBeds = num;
    this.initBedrooms();
    this.selectedBedRoom = num;
    this.submitForm.patchValue({ bedroom: this.selectedBedRoom });
    this.numberOfBed = Array(num)
      .fill(0)
      .map((_, index) => index + 1);
    this.selectedOption = null;
    this.selectPreValue = num.toString();
    this.showSection = true;
    this.selectedValue = '5+';
  }
  selectBalconiesOption(baconiesoptions: string) {
    this.selectedBalconiesValue = baconiesoptions;
    this.submitForm.patchValue({ balconies: this.selectedBalconiesValue });
    this.selectedBalconiesOption = baconiesoptions;
    this.selectedBalcony = null;
    this.isbalconiDropdownOpen = this.isbalconiDropdownOpen;
  }

  fetchLandZone() {
    this.PostpropertyfreeService.getLandZone().subscribe((res: any) => {
      this.landZone = res.data;
    });
  }
  fetchBusinesssector() {
    this.PostpropertyfreeService.getBusinesssector().subscribe((res: any) => {
      this.BusinessSector = res.data;
    });
  }
  fetchCities() {
    this.PostpropertyfreeService.getCities().subscribe((res: any) => {
      this.cities = res.data;
    });
  }
  onCityChange(event: any) {
    const selectedCity:any = event.target.value;
    this.fetchLocalities(selectedCity);
  }
  fetchLocalities(city:any) {
    this.PostpropertyfreeService.getLocalities(city).subscribe((res: any) => {
      this.localities = res.responseData.data;
    });
  }
  onLocalityChange(event:any) {
    const selectedLocality:any = event.target.value;
    this.fetchProjectList(selectedLocality);
  }
  fetchProjectList(locality:any) {
    this.PostpropertyfreeService.getProjectList(locality).subscribe((res:any)=> {
      this.projectList =res.responseData.addproject;
    });
  }

  propertyForm() {
    const userId = localStorage.getItem('userId');
    this.submitForm.patchValue({ user_id: userId });
    console.log(this.submitForm.invalid);
    console.log(this.submitForm.value);

    if (this.submitForm.invalid) {
      this.submitForm.markAllAsTouched();

      Object.keys(this.submitForm.controls).forEach(key => {
        const control = this.submitForm.get(key);
        if (control && control.invalid) {
          console.log(`Invalid field: ${key}`, control.errors);
        }
      });
      return;
    }

    let payload = this.submitForm.value;
    this.http.post(`${environment.apiUrl}addproperty`, payload).subscribe(
      (res: any) => {
        this.toastr.success('Your Property Post successfully.');
      },
      (error) => {
        console.error('Error sending data', error);
      }
    );
  }

  validateNameInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      event.preventDefault();
    }
  }

  validateEmailInput(event: KeyboardEvent) {
    const invalidChars = [' ', ',', ';', '"', `'`, '`'];
    if (invalidChars.includes(event.key)) {
      event.preventDefault();
    }
  }
}
