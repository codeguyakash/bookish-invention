import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Inject,PLATFORM_ID, APP_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { isPlatformBrowser, DatePipe } from '@angular/common';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

/**
 * Custom Created Modules
 */
import { customerCareModule } from './modules/customer-care/cutomer-care.module';
import { employeePanelModule } from './modules/employee-panel/employee-panel.module';
import { MessageModule } from './modules/message/message.module';



/**
* Global Components For Website
*/
import { AlertComponent } from './components/alerts/alert.component'
import { EmployeeLoginComponent } from './components/login/login.component';
import { ProjectmanagerTasksubmitComponent } from './components/projectmanager-tasksubmit/projectmanager-tasksubmit.component';
import { CalendarModule } from 'primeng/primeng';
// import { SmartSearch } from '../app/modules/employee-panel/smart-search/smart-search.component';


/**
* Global Layouts
* Website Holds the Layout for website
*/
import { CustomerCareLayout } from './layout/customer-care/layout';
import { SiteSurveyorLayout } from './layout/site-surveyor/layout';

/**
 * App Routes
 */
import { APP_ROUTES } from './routes/app.routes';

/**
 * Custom Services
 */
import { SharedServices } from './services/shared.services';

import { AlertServices } from './services/alert.services';

import { EmployeeServices } from './services/employee.services';

import { AppComponent } from './app.component';
import { FilterCareLayout } from './layout/filter-Care/layout';
// import { WebForm } from './components/webform/webform.component';
import { WebformModule } from './modules/web-form/web-form.module';
import { WebFormLayout } from './layout/webform/layout';

@NgModule({
  declarations: [
    AlertComponent,
    CustomerCareLayout,
    SiteSurveyorLayout,
    WebFormLayout,
    FilterCareLayout,
    AppComponent,
    EmployeeLoginComponent,
    //WebForm,
    ProjectmanagerTasksubmitComponent,
    // SmartSearch
  ],
  exports: [
    EmployeeLoginComponent,
    //WebForm,
    ProjectmanagerTasksubmitComponent,
    AlertComponent,
    // SmartSearch
],
  imports: [
    BrowserModule.withServerTransition({ appId: 'luminous-angular' }),
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    customerCareModule,
    WebformModule,
    CalendarModule,
    employeePanelModule,
    MessageModule,
    APP_ROUTES,
    ReactiveFormsModule,
    FormsModule,
    ModuleMapLoaderModule
  ],
  providers: [
    SharedServices,
    AlertServices,
    EmployeeServices,
    DatePipe
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})

export class AppModule {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string) {
    const platform = isPlatformBrowser(platformId) ?
      'in the browser' : 'on the server';
    console.log(`Running ${platform} with appId=${appId}`);
  }
}
