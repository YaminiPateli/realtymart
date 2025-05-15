import { CUSTOM_ELEMENTS_SCHEMA, Component, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrModule } from 'ngx-toastr';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { PropertyServicesComponent } from './components/property-services/property-services.component';
import { PropertyServicesListingComponent } from './components/property-services-listing/property-services-listing.component';
import { BuilderListingComponent } from './components/builder-listing/builder-listing.component';
import { BuilderPropertyListingComponent } from './components/builder-property-listing/builder-property-listing.component';
import { ExploreBuildersComponent } from './components/explore-builders/explore-builders.component';
import { ExploreLocalitiesComponent } from './components/explore-localities/explore-localities.component';
import { register } from 'swiper/element/bundle';
import { BuyNewProjectsComponent } from './components/buy-new-projects/buy-new-projects.component';
import { GoldPackageComponent } from './components/gold-package/gold-package.component';
import { YourCartComponent } from './components/your-cart/your-cart.component';
import { AdPackagesComponent } from './components/ad-packages/ad-packages.component';
import { ProfilesComponent } from './components/profiles/profiles.component';
import { SellingGuideComponent } from './components/selling-guide/selling-guide.component';
import { AgentsDetailsComponent } from './components/agents-details/agents-details.component';
import { PostPropertyFreeComponent } from './components/post-property-free/post-property-free.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSliderModule } from 'ngx-slider-v2';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BuilderDetailComponent } from './components/builder-detail/builder-detail.component';
import { ServicesDetailComponent } from './components/services-detail/services-detail.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './components/terms-conditions/terms-conditions.component';
import { ContactComponent } from './components/contact/contact.component';
import { MatchingPropertiesComponent } from './components/matching-properties/matching-properties.component';
import { MatchingPropertiesEditComponent } from './components/matching-properties-edit/matching-properties-edit.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { CareerComponent } from './components/career/career.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { AgentsComponent } from './components/agents/agents.component';
import { BlogComponent } from './components/blog/blog.component';
import { BlogDetailsComponent } from './components/blog-details/blog-details.component';
import { EmiCalculatorComponent } from './components/emi-calculator/emi-calculator.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PropertyDetailsComponent } from './components/property-details/property-details.component';
import { ProjectdetailsComponent } from './components/projectdetails/projectdetails.component';
import { TopbuildersComponent } from './components/topbuilders/topbuilders.component';
import { VerifiedpropertyRentComponent } from './components/verifiedproperty/verifiedpropertyrent.component';
import { VerifiedpropertyComponent } from './components/verifiedproperty/verifiedproperty.component';
import { NewlylaunchedComponent } from './components/newlylaunched/newlylaunched.component';
import { OwnerpropertyComponent } from './components/ownerproperty/ownerproperty.component';
import { OwnerpropertyrentComponent } from './components/ownerpropertyrent/ownerpropertyrent.component';
import { PropertyValuationComponent } from './components/property-valuation/property-valuation.component';
import { TitleCheckComponent } from './components/title-check/title-check.component';
import { FindPincodeComponent } from './components/find-pincode/find-pincode.component';
import { PropertytypesbuyComponent } from './components/propertytypesbuy/propertytypesbuy.component';
import { PropertytypesrentComponent } from './components/propertytypesrent/propertytypesrent.component';
import { ProjectsincityComponent } from './components/projectsincity/projectsincity.component';
import { AgentprojectsrentComponent } from './components/agentprojectsrent/agentprojectsrent.component';
import { InvestmentHotspotComponent } from './components/investment-hotspot/investment-hotspot.component';
import { TipsAndGuidesComponent } from './components/tips-and-guides/tips-and-guides.component';
import { LocalitiesprojectlistingComponent } from './components/localitiesprojectlisting/localitiesprojectlisting.component';
import { CustomAutocompleteComponent } from './components/custom-autocomplete/custom-autocomplete.component';
import { ProjectFeaturedComponent } from './components/project-featured/project-featured.component';
import { LightboxModule } from 'ngx-lightbox';
import { ShortlistedPropertiesComponent } from './components/shortlisted-properties/shortlisted-properties.component';
import { ResearchInsightsComponent } from './components/research-insights/research-insights.component';
import { PayingGuestForComponent } from './components/paying-guest-for/paying-guest-for.component';
import { PayingGuestDetailComponent } from './components/paying-guest-detail/paying-guest-detail.component';
import { LoginComponent } from './components/login/login.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { RegisterComponent } from './components/register-form/register.component';
import { ThankYouRegisterComponent } from './components/thank-you-register/thank-you-register.component';
import { BuilderAllProjectListComponent } from './components/builder-projects/builder-project.component';
import { ProjectApproveDetailComponent } from './components/project-approve-detail/project-approve-detail.component';
import { PropertyincitybuyComponent } from './components/propertyincitybuy/propertyincitybuy.component';
import { PropertyincityrentComponent } from './components/propertyincityrent/propertyincityrent.component';
import { CookieConsentComponent } from './components/cookie-consent/cookie-consent.component';

// Page Routing
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'registration', component:RegisterComponent },
  { path: 'property-services', component: PropertyServicesComponent },
  { path: 'property-services/:name', component: PropertyServicesListingComponent },
  { path: 'builder-listing/:city', component: BuilderListingComponent },
  { path: 'builder-property-listing/:id/:type', component: BuilderPropertyListingComponent },
  { path: 'builder-project-listing/:name', component:BuilderAllProjectListComponent},
  { path: 'explore-builders', component: ExploreBuildersComponent },
  { path: 'explore-localities/:city', component: ExploreLocalitiesComponent },
  { path: 'buy-new-projects', component: BuyNewProjectsComponent },
  { path: 'gold-package', component: GoldPackageComponent },
  { path: 'your-cart', component: YourCartComponent },
  { path: 'ad-packages', component: AdPackagesComponent },
  { path: 'profiles', component: ProfilesComponent },
  { path: 'selling-guide', component:  SellingGuideComponent },
  { path: 'agents-details/:name', component:  AgentsDetailsComponent },
  { path: 'post-property-free', component:  PostPropertyFreeComponent },
  { path: 'builder-detail/:id', component:  BuilderDetailComponent },
  { path: 'company-detail/:name/:id', component:  ServicesDetailComponent },
  { path: 'privacy-policy', component:  PrivacyPolicyComponent },
  { path: 'terms-conditions', component:  TermsConditionsComponent },
  { path: 'contact', component:  ContactComponent },
  { path: 'search-property', component:  MatchingPropertiesComponent },
  { path: 'matching-properties-edit', component:  MatchingPropertiesEditComponent },
  { path: 'about-us', component:  AboutUsComponent },
  { path: 'career', component:  CareerComponent },
  { path: 'projects', component:  ProjectsComponent },
  { path: 'agents/:city', component:  AgentsComponent },
  { path: 'blogs', component:  BlogComponent },
  { path: 'blog-details/:blogurl', component:  BlogDetailsComponent },
  { path: 'emi-calculator', component:  EmiCalculatorComponent },
  { path: 'property-details/:name/:id', component:  PropertyDetailsComponent },
  { path: 'project-details/:name/:id/', component:  ProjectFeaturedComponent },
  { path: 'top-builders', component:  TopbuildersComponent },
  { path: 'verified-property-buy/:city', component:  VerifiedpropertyComponent },
  { path: 'verified-property-rent/:city', component:  VerifiedpropertyRentComponent },
  { path: 'newly-launched', component:  NewlylaunchedComponent },
  { path: 'owner-property-buy/:city', component:  OwnerpropertyComponent },
  { path: 'owner-property-rent/:city', component:  OwnerpropertyrentComponent },
  { path: 'property-valuation', component:  PropertyValuationComponent },
  { path: 'title-check', component:  TitleCheckComponent },
  { path: 'find-pincode', component:  FindPincodeComponent },
  { path: 'property-for-buy/:type/:city', component:  PropertytypesbuyComponent },
  { path: 'property-for-rent/:type/:city', component:  PropertytypesrentComponent },
  { path: 'projects-in-city/:city', component:  ProjectsincityComponent },
  { path: 'property-for-buy-in/:city', component: PropertyincitybuyComponent },
  { path: 'property-for-rent-in/:city', component: PropertyincityrentComponent },
  { path: 'agent-projects-rent/:id', component:  AgentprojectsrentComponent },
  { path: 'investment-hotspot', component:  InvestmentHotspotComponent },
  { path: 'tips-and-guides', component:  TipsAndGuidesComponent },
  { path: 'localities-projects/:localities', component:  LocalitiesprojectlistingComponent },
  { path: 'custom-autocomplete', component:  CustomAutocompleteComponent },
  { path: 'project-details/:name/:id', component:  ProjectFeaturedComponent },
  { path: 'shortlisted-properties', component:  ShortlistedPropertiesComponent },
  { path: 'research-insights', component:  ResearchInsightsComponent },
  { path: 'paying-guest-for/:type/:city', component:  PayingGuestForComponent },
  { path: 'paying-guest-detail/:name/:id', component:  PayingGuestDetailComponent },
  { path: 'login', component:  LoginComponent },
  { path: 'project-approval-details/:name/:id', component: ProjectApproveDetailComponent},
  { path: 'thank-you-register', component:  ThankYouRegisterComponent },
];

// register Swiper custom elements
register();

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PropertyServicesComponent,
    PropertyServicesListingComponent,
    BuilderListingComponent,
    BuilderPropertyListingComponent,
    BuilderAllProjectListComponent,
    ExploreBuildersComponent,
    ExploreLocalitiesComponent,
    BuyNewProjectsComponent,
    GoldPackageComponent,
    YourCartComponent,
    AdPackagesComponent,
    ProfilesComponent,
    AgentsDetailsComponent,
    PostPropertyFreeComponent,
    BuilderDetailComponent,
    PrivacyPolicyComponent,
    TermsConditionsComponent,
    ContactComponent,
    MatchingPropertiesComponent,
    AboutUsComponent,
    MatchingPropertiesEditComponent,
    VerifiedpropertyRentComponent,
    VerifiedpropertyComponent,
    ProjectsComponent,
    AgentsComponent,
    BlogComponent,
    BlogDetailsComponent,
    EmiCalculatorComponent,
    PropertyDetailsComponent,
    ProjectdetailsComponent,
    TopbuildersComponent,
    NewlylaunchedComponent,
    OwnerpropertyComponent,
    OwnerpropertyrentComponent,
    PropertyValuationComponent,
    TitleCheckComponent,
    FindPincodeComponent,
    PropertytypesbuyComponent,
    PropertytypesrentComponent,
    ProjectsincityComponent,
    AgentprojectsrentComponent,
    LocalitiesprojectlistingComponent,
    CustomAutocompleteComponent,
    ProjectFeaturedComponent,
    ShortlistedPropertiesComponent,
    ResearchInsightsComponent,
    PayingGuestForComponent,
    PayingGuestDetailComponent,
    ThankYouRegisterComponent,
    ProjectApproveDetailComponent,
    PropertyincitybuyComponent,
    PropertyincityrentComponent,
    CookieConsentComponent,
  ],
  imports: [
    LoginComponent,
    HomeComponent,
    CareerComponent,
    BrowserModule,
    SlickCarouselModule,
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSliderModule,
    InfiniteScrollModule,
    ServicesDetailComponent,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    LightboxModule,
    GoogleMapsModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  exports: [RouterModule]
})
export class AppModule {

 }
