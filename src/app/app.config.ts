import {ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideFormlyCore} from '@ngx-formly/core';
import {DaterangepickerFieldType} from './shared/formly/type/daterangepicker-field.type';
import {
  provideDaterangepickerLocale
} from '../../projects/ngx-daterangepicker-bootstrap/src/lib/utils/ngx-daterangepicker-locale.provider';
import {withFormlyBootstrap} from '@ngx-formly/bootstrap';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideDaterangepickerLocale({
      separator: ' - ',
      applyLabel: 'Okay',
    }),
    provideFormlyCore([{
      types: [
        {
          name: 'daterangepicker',
          component: DaterangepickerFieldType,
          wrappers: ['form-field']
        },
      ],
    },
      ...withFormlyBootstrap(),
    ]),
  ]
};
