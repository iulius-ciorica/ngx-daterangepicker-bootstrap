import {ModuleWithProviders, NgModule} from '@angular/core';
import {NgxDaterangepickerBootstrapComponent} from './ngx-daterangepicker-bootstrap.component';
import {NgxDaterangepickerBootstrapDirective} from "./ngx-daterangepicker-bootstrap.directive";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LOCALE_CONFIG, LocaleConfig} from "./ngx-daterangepicker-locale.config";
import {NgxDaterangepickerLocaleService} from "./ngx-daterangepicker-locale.service";


@NgModule({
  declarations: [
    NgxDaterangepickerBootstrapComponent,
    NgxDaterangepickerBootstrapDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
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
