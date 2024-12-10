import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {
  provideDaterangepickerLocale
} from '../../projects/ngx-daterangepicker-bootstrap/src/lib/utils/ngx-daterangepicker-locale.provider';
import {FormlyModule} from '@ngx-formly/core';
import {DaterangepickerFieldType} from './shared/formly/type/daterangepicker-field.type';
import {AnimatedFieldWrapper} from './shared/formly/wrapper/animated-field.wrapper';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideDaterangepickerLocale({
      separator: ' - ',
      applyLabel: 'Okay',
    }),
    importProvidersFrom([
      FormlyModule.forRoot({
        types: [
          {
            name: 'daterangepicker',
            component: DaterangepickerFieldType,
            wrappers: ['form-field']
          },
        ],
        wrappers: [
          {
            name: 'form-field',
            component: AnimatedFieldWrapper
          },
        ]
      }),
    ]),
  ]
};
