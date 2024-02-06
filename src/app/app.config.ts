import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {
  provideDaterangepickerLocale
} from "../../projects/ngx-daterangepicker-bootstrap/src/lib/utils/ngx-daterangepicker-locale.provider";
// import {
//   NgxDaterangepickerBootstrapModule
// } from "../../projects/ngx-daterangepicker-bootstrap/src/lib/modules/ngx-daterangepicker-bootstrap.module";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideDaterangepickerLocale({
      separator: ' - ',
      applyLabel: 'Okay',
    })
    // importProvidersFrom(NgxDaterangepickerBootstrapModule.forRoot({
    //   separator: ' - ',
    //   applyLabel: 'Okay',
    // }))
  ]
};
