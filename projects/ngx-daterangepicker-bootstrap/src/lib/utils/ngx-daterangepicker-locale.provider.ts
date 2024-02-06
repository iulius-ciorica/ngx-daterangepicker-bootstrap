import {EnvironmentProviders, makeEnvironmentProviders} from "@angular/core";
import {LOCALE_CONFIG, LocaleConfig} from "./ngx-daterangepicker-locale.config";
import {NgxDaterangepickerLocaleService} from "../services/ngx-daterangepicker-locale.service";

export function provideDaterangepickerLocale(config: LocaleConfig = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    {provide: LOCALE_CONFIG, useValue: config},
    {provide: NgxDaterangepickerLocaleService, useClass: NgxDaterangepickerLocaleService, deps: [LOCALE_CONFIG]}
  ]);
}
