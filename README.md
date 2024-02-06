# ngx-daterangepicker-bootstrap

> Date range picker - Angular 17 and Bootstrap 5

This `Angular Bootstrap` plugin is compatible with Angular 17. \
It leverages `dayjs` to handle date manipulation and parsing and `Bootstrap 5` is used for visual details. \
This plugin is a fork of [NgxDaterangepickerMaterial](https://github.com/fetrarij/ngx-daterangepicker-material) by Fetrarijaona R. which is an improved version that uses `Bootstrap 5`. \
The base for this plugin was originally the [Bootstrap Date Range Picker](http://www.daterangepicker.com), but its dependencies on `jQuery` and `moment.js` were removed.

![](https://i.postimg.cc/mkjyzxk5/ngx-daterangepicker-bootstrap.png)

---

## Versions

| Angular | Bootstrap | ngx-daterangepicker-bootstrap |
|---------|:----------|:-----------------------------:|
| 17.1.0  | 5.3.0     |            17.5.x             |
| 16.2.0  | 5.3.0     |            16.5.x             |
| 15.1.0  | 5.2.0     |            15.5.x             |
| 14.1.0  | 5.2.0     |            14.5.x             |


---

## Installation

Install the plugin from npm:

`npm install ngx-daterangepicker-bootstrap --save`

---
## Configuration for standalone, version 17

[StackBlitz | Date Range Picker - Angular 17 and Bootstrap 5](https://stackblitz.com/edit/ngx-daterangepicker-bootstrap-17-5-0)

Using new standalone:

import **provideDaterangepickerLocale** provider function **(recomended)**, in app.config.ts:

````typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideDaterangepickerLocale } from "ngx-daterangepicker-bootstrap";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideDaterangepickerLocale({
      separator: ' - ',
      applyLabel: 'Okay',
    })
  ]
};

````
import **NgxDaterangepickerBootstrapComponent** standalone component \
and **NgxDaterangepickerBootstrapDirective** standalone directive, in your component (example app.component.ts)
````typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule} from "@angular/forms";
import { NgxDaterangepickerBootstrapDirective, NgxDaterangepickerBootstrapComponent } from "ngx-daterangepicker-bootstrap";
import dayjs, { Dayjs } from "dayjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, NgxDaterangepickerBootstrapDirective, NgxDaterangepickerBootstrapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  ...
}

````
---
or, using old module:

import **NgxDaterangepickerBootstrapModule** module, in app.config.ts:
````typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { NgxDaterangepickerBootstrapModule } from "ngx-daterangepicker-bootstrap";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(NgxDaterangepickerBootstrapModule.forRoot({
      separator: ' - ',
      applyLabel: 'Okay',
    }))
  ]
};

````

import **NgxDaterangepickerBootstrapModule** module, in your component (example app.component.ts)
````typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { NgxDaterangepickerBootstrapModule } from "ngx-daterangepicker-bootstrap";
import dayjs, { Dayjs } from "dayjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, NgxDaterangepickerBootstrapModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  ...
}

````

---

## Configuration for module, versions 17, 16, 15 and 14

[StackBlitz | Date Range Picker - Angular 16 and Bootstrap 5](https://stackblitz.com/edit/ngx-daterangepicker-bootstrap-16-5-0)

import **NgxDaterangepickerModule** and **NgxDaterangepickerLocaleService** in your module:

````typescript
...
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerModule } from 'ngx-daterangepicker-bootstrap';
import { AppComponent } from './app';

@NgModule({
    imports: [
        ... ,
        FormsModule,
        NgxDaterangepickerBootstrapModule.forRoot()
    ],
    providers: [NgxDaterangepickerLocaleService],
    declarations: [AppComponent],
    bootstrap:    [AppComponent]
})
export class AppModule {}
````

## Usage example

Html:

```html
<input type="text" ngxDaterangepickerBootstrap [(ngModel)]="selected" class="form-control"/>
```
Typescript:

````typescript
selected: {startDate: Dayjs, endDate: Dayjs};
````
### with some options:
Html:

```html
<input type="text"
       ngxDaterangepickerBootstrap
       [locale]="{applyLabel: 'ok', format: 'DD-MM-YYYY'}"
       startKey="start"
       endKey="end"
       [(ngModel)]="selected"
       name="daterange"/>
```
Typescript:

````typescript
selected: {start: Dayjs, end: Dayjs};
````
You can [play with our online demo here](https://fetrarij.github.io/ngx-daterangepicker-material/)
and [browse our demo code here](./demo/src/app).

## Inline usage

You can use the component directly in your templates, which will set its `inline` mode to **true**, in which case the calendar won't hide after date/range selection. You can then use the events: `rangeClicked` or `datesUpdated` or `chosenDate` to get its selection state.

```html
<ngx-daterangepicker-bootstrap (chosenDate)="chosenDate($event)">
</ngx-daterangepicker-bootstrap>
```

Here is the demo of the forked version for other detalis: https://fetrarij.github.io/ngx-daterangepicker-material/

## Available options

### autoApply, showDropdowns, singleDatePicker, showWeekNumbers, showISOWeekNumbers, alwaysShowCalendars, showClearButton, showCancel

>These options are booleans

### isCustomDate

>(function) A function that is passed each date in the calendars before they are displayed, and may return a string or array of CSS class names to apply to that date's calendar cell

### isInvalidDate
>(function) A function that is passed each date in the two calendars before they are displayed, and may return true or false to indicate whether that date should be available for selection or not.

### isTooltipDate
>(function) A function that is passed each date in the two calendars before they are displayed, and may return a text to be displayed as a tooltip.

### minDate, maxDate

>To set the minimal and maximal date, these options are either a dayjs date or string in [ISO](https://www.w3.org/QA/Tips/iso-date) format

### dateLimit

>To set max number of the date we can choose

### locale

>the locale options is an object with:
```javascript
{
    format: 'MM/DD/YYYY', // could be 'YYYY-MM-DDTHH:mm:ss.SSSSZ'
    displayFormat: 'MM/DD/YYYY', // default is format value
    direction: 'ltr', // could be rtl
    weekLabel: 'W',
    separator: ' To ', // default is ' - '
    cancelLabel: 'Cancel', // detault is 'Cancel'
    applyLabel: 'Okay', // detault is 'Apply'
    clearLabel: 'Clear', // detault is 'Clear'
    customRangeLabel: 'Custom range',
    daysOfWeek: dayjs.weekdaysMin(),
    monthNames: dayjs.monthsShort(),
    firstDay: 1 // first day is monday
}
```
[Check here](#global-locale) for setting the global locale

### startKey and endKey

Theses 2 options are for the key you want for the value, default are `startDate` and `endDate`, it means the value we have from ngModel are: `{startDate: Date, endDate: Date}` by default;

Specifiyng `startKey` and `endKey` would have different model:

example:
```html
<input type="text" ngxDaterangepickerBootstrap startKey="start" endKey="end" [(ngModel)]="model">
```

the model we got would be:  `{start: Date, end: Date}`

### ranges

(object) Set predefined date ranges the user can select from. Each key is the label for the range, and its value an array with two dates representing the bounds of the range. As an example:
```html
<input type="text" ngxDaterangepickerBootstrap startKey="start" endKey="end" [ranges]="ranges" [(ngModel)]="model">
```
```javascript
ranges: any = {
    'Today': [dayjs(), dayjs()],
    'Yesterday': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Last 7 Days': [dayjs().subtract(6, 'days'), dayjs()],
    'Last 30 Days': [dayjs().subtract(29, 'days'), dayjs()],
    'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Last Month': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }
```
#### Other options with ranges

You can use bellow options when using the ranges. The default are `false`.

| Attribut | Type |Description |
| --- | --- |--- |
| alwaysShowCalendars | boolean | set to `true` if you want to display the ranges with the calendar |
| keepCalendarOpeningWithRange | boolean | set to `true` if you want the calendar won't be closed after choosing a range |
| showRangeLabelOnInput | boolean | set to `true` if you want to display the range label on input |
| customRangeDirection | boolean | set to `true` if you want to allow selection range from end date first |
| lockStartDate | boolean | set to `true` if you want to lock start date and change only the end date |

#### Open datepicker from outside

It is possible to open datepicker from outside. You should create an input with attached datepicker directive and a button with "ngx-daterangepicker-action" class (to prevent triggering of clickOutside).
```html
    <input type="text"
           id="input"
           class="form-control"
           ngxDaterangepickerBootstrap
           [closeOnAutoApply]="true"
           [autoApply]="true"
           [singleDatePicker]="true"
           [linkedCalendars]="true"
           [(ngModel)]="selected"
           (datesUpdated)="datesUpdated($event)">

    <a class="ngx-daterangepicker-action" (click)="openDatepicker()">
      Open
    </a>
```

```typescript

  ...
    @ViewChild(NgxDaterangepickerBootstrapDirective, { static: false }) pickerDirective: NgxDaterangepickerBootstrapDirective;
  ...
  ...
  openDatepicker() {
    this.pickerDirective.open();
  }
```

### Timepicker

You have to set the attribute `timePicker` to `true` if you want to enable the timepicker.

You can use theses options:

| Attribut | Type |Description |
| --- | --- |--- |
| timePicker24Hour | boolean | set to `true` if you want to set the timepicker to 24h instead of having AM and PM |
| timePickerIncrement | number | set the value increment of the minutes (eg: for `12` there would be 0mn, 15mn, 30mn, 45mn,) |
| timePickerSeconds | boolean | set `true` if you want do display second's select |


### Customisation

| Attribut | Type |Description |
| --- | --- |--- |
| firstMonthDayClass | string | add a custom class for all first day of the month |
| lastMonthDayClass | string | add a custom class for all last day of the month |
| emptyWeekRowClass | string | add a custom class in a row with a date in a week not in the current month |
| emptyWeekColumnClass | string | add a custom class for all date in a week not in the current month |
| lastDayOfPreviousMonthClass | string | add a custom class for the last day of the previous month |
| firstDayOfNextMonthClass | string | add a custom class for the first day of the next month |

### Positioning

| Attribut | Possible values |Description |
| --- | --- |--- |
| opens | left, center, right | position the calendar from the input element |
| drops | up, down | position the calendar to the up or down of the calendar |

## Available events

### \(rangeClicked)

>Fired when clicked on range, and send an object with range label and dates value, eg:  `{label: 'This Month', dates: [Dayjs, Dayjs]}`

### \(datesUpdated)

>Fires when the date model is updated, like applying (if you have activated the apply button), or when selecting a range or date without the apply button, and sends an object containing start and end dates, eg: `{startDate: Dayjs, endDate: Dayjs, label: 'This Month'}`

### \(clearClicked)

>Fired when clicked on the clear button

### Global locale

For setting the global locale, pass this object to NgxDaterangepickerModule.forRoot().

eg:

```typescript
@NgModule({
    imports: [
        ... ,
        FormsModule,
        NgxDaterangepickerBootstrapModule.forRoot({
            separator: ' - ',
            applyLabel: 'Okay',
        })
    ],
    providers: [NgxDaterangepickerLocaleService],
    declarations: [AppComponent],
    bootstrap:    [AppComponent]
})
```

## Development

### Prepare your environment

Install local dependencies: `npm install`.

### Development server

Run `npm start` to start a development server on a port 4200.

Open `http//:localhost:4200` on your browser.

## Tests

Run `npm test` or `ng test` to run tests.


## [License](https://github.com/iulius.ciorica/ngx-daterangepicker-bootstrap/blob/master/LICENSE)
MIT
