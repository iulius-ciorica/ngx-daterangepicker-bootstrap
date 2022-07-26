import {Inject, Injectable} from '@angular/core';
import {DefaultLocaleConfig, LOCALE_CONFIG, LocaleConfig} from "./ngx-daterangepicker-locale.config";

@Injectable()
export class NgxDaterangepickerLocaleService {

  constructor(@Inject(LOCALE_CONFIG) private _config: LocaleConfig) {
  }

  get config() {
    if (!this._config) {
      return DefaultLocaleConfig;
    }
    return {...DefaultLocaleConfig, ...this._config};
  }

}
