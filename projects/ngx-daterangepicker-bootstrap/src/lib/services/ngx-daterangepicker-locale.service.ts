import {inject, Injectable} from '@angular/core';
import {DefaultLocaleConfig, LOCALE_CONFIG, LocaleConfig} from '../utils/ngx-daterangepicker-locale.config';

@Injectable({
  providedIn: 'root'
})
export class NgxDaterangepickerLocaleService {

  private _config = inject<LocaleConfig>(LOCALE_CONFIG);

  get config() {
    if (!this._config) {
      return DefaultLocaleConfig;
    }
    return {...DefaultLocaleConfig, ...this._config};
  }

}
