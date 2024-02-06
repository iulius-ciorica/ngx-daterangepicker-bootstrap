import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxDaterangepickerBootstrapComponent} from "../components/daterangepicker/ngx-daterangepicker-bootstrap.component";
import {NgxDaterangepickerBootstrapDirective} from "../directives/ngx-daterangepicker-bootstrap.directive";
import {LOCALE_CONFIG, LocaleConfig} from "../utils/ngx-daterangepicker-locale.config";
import {NgxDaterangepickerLocaleService} from "../services/ngx-daterangepicker-locale.service";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDaterangepickerBootstrapComponent,
    NgxDaterangepickerBootstrapDirective
  ],
  exports: [
    NgxDaterangepickerBootstrapComponent,
    NgxDaterangepickerBootstrapDirective
  ]
})
export class NgxDaterangepickerBootstrapModule {

  static forRoot(config: LocaleConfig = {}): ModuleWithProviders<NgxDaterangepickerBootstrapModule> {
    return {
      ngModule: NgxDaterangepickerBootstrapModule,
      providers: [
        {provide: LOCALE_CONFIG, useValue: config},
        {provide: NgxDaterangepickerLocaleService, useClass: NgxDaterangepickerLocaleService, deps: [LOCALE_CONFIG]}
      ]
    };
  }

}
