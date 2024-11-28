import {Inject, Injectable} from '@angular/core';
import {DefaultLocaleConfig, LOCALE_CONFIG, LocaleConfig} from '../utils/ngx-daterangepicker-locale.config';

@Injectable({
  providedIn: 'root'
})
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
