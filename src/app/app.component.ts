import {Component} from '@angular/core';
import dayjs, {Dayjs} from 'dayjs';
import {
  NgxDaterangepickerBootstrapDirective
} from "../../projects/ngx-daterangepicker-bootstrap/src/lib/directives/ngx-daterangepicker-bootstrap.directive";
import {
  NgxDaterangepickerBootstrapComponent
} from "../../projects/ngx-daterangepicker-bootstrap/src/lib/components/daterangepicker/ngx-daterangepicker-bootstrap.component";
import {FormGroup, FormsModule} from '@angular/forms';
import {FormlyFieldConfig, FormlyFormOptions, FormlyModule} from '@ngx-formly/core';
import {DatePipe} from '@angular/common';

export function formatDate(date: any, format: string): string {
  return new DatePipe('en-US').transform(date, format)!.toString();
}

@Component({
  selector: 'app-root',
  imports: [NgxDaterangepickerBootstrapDirective, FormsModule, NgxDaterangepickerBootstrapComponent, FormlyModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  title: string = 'ngx-daterangepicker-bootstrap-sdk';
  dropsDown: string = 'down';
  dropsUp: string = 'up';
  opensRight: string = 'right';
  opensCenter: string = 'center';
  opensLeft: string = 'left';
  selectedRangeCalendarTimeRight: any;
  selectedRangeCalendarCenter: any;
  selectedRangeCalendarAutoLeft: any;
  selectedSingleCalendarTimeRight: any;
  selectedSingleCalendarCenter: any;
  selectedSingleCalendarAutoLeft: any;
  selectedSimpleCalendarTimeUpRight: any;
  selectedSimpleCalendarUpCenter: any;
  selectedSimpleCalendarAutoUpLeft: any;
  selectedRangeCalendarTimeInline: any;
  maxDate?: Dayjs;
  minDate?: Dayjs;
  invalidDates: Dayjs[] = [];
  ranges: any = {
    'Today': [dayjs().startOf('day'), dayjs().endOf('day')],
    'Yesterday': [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')],
    'Last 7 days': [dayjs().subtract(6, 'days').startOf('day'), dayjs().endOf('day')],
    'Last 30 days': [dayjs().subtract(29, 'days').startOf('day'), dayjs().endOf('day')],
    'This month': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Last month': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  };
  localeTime: {
    firstDay: number;
    startDate: Dayjs;
    endDate: Dayjs;
    format: string;
    applyLabel: string;
    cancelLabel: string;
    fromLabel: string;
    toLabel: string
  } = {
    firstDay: 1,
    startDate: dayjs().startOf('day'),
    endDate: dayjs().endOf('day'),
    format: 'DD.MM.YYYY HH:mm:ss',
    applyLabel: 'Apply',
    cancelLabel: 'Cancel',
    fromLabel: 'From',
    toLabel: 'To',
  };
  locale: {
    firstDay: number;
    startDate: Dayjs;
    endDate: Dayjs;
    format: string;
    applyLabel: string;
    cancelLabel: string;
    fromLabel: string;
    toLabel: string
  } = {
    firstDay: 1,
    startDate: dayjs().startOf('day'),
    endDate: dayjs().endOf('day'),
    format: 'DD.MM.YYYY',
    applyLabel: 'Apply',
    cancelLabel: 'Cancel',
    fromLabel: 'From',
    toLabel: 'To',
  };
  tooltips: ({ date: Dayjs; text: string })[] = [
    {date: dayjs(), text: 'Today is just unselectable'},
    {date: dayjs().add(2, 'days'), text: 'Yeeeees!!!'}
  ];

  public currentDay: { start: string; end: string; label: string } = {
    start: formatDate(dayjs().startOf('day'), 'yyyy-MM-dd HH:mm:ss'),
    end: formatDate(dayjs().endOf('day'), 'yyyy-MM-dd HH:mm:ss'),
    label: 'Today',
  };
  public form: FormGroup<{}> = new FormGroup({});
  public model: any = {};
  public options: FormlyFormOptions = {formState: {}};
  public fields: Array<FormlyFieldConfig> = [
    {
      key: 'dateRange',
      type: 'daterangepicker',
      className: 'col-md-4',
      defaultValue: this.currentDay,
      props: {
        label: this.currentDay.label,
        description: 'Ngx-Formly is a dynamic (JSON powered) form library for Angular, please see https://formly.dev',
        readonly: true,
        selectedDate: ($event: any): void => console.log('ngx-formly', $event),
      },
    },
  ];

  constructor() {
    this.selectedRangeCalendarTimeRight = {
      startDate: dayjs().startOf('day'),
      endDate: dayjs().endOf('day')
    };
    this.selectedRangeCalendarCenter = {
      startDate: dayjs().startOf('day'),
      endDate: dayjs().endOf('day')
    };
    this.selectedRangeCalendarAutoLeft = {
      startDate: dayjs().startOf('day'),
      endDate: dayjs().endOf('day')
    };
    this.selectedSingleCalendarTimeRight = dayjs().startOf('day');
    this.selectedSingleCalendarCenter = dayjs().startOf('day');
    this.selectedSingleCalendarAutoLeft = dayjs().startOf('day');
    this.selectedSimpleCalendarTimeUpRight = {
      startDate: dayjs().startOf('day'),
      endDate: dayjs().endOf('day')
    };
    this.selectedSimpleCalendarUpCenter = {
      startDate: dayjs().startOf('day'),
      endDate: dayjs().endOf('day')
    };
    this.selectedSimpleCalendarAutoUpLeft = {
      startDate: dayjs().startOf('day'),
      endDate: dayjs().endOf('day')
    };
    this.selectedRangeCalendarTimeInline = {
      startDate: dayjs().startOf('day'),
      endDate: dayjs().endOf('day')
    };
  }

  isInvalidDate: (m: Dayjs) => boolean = (m: Dayjs): boolean => {
    return this.invalidDates.some((d: Dayjs): boolean => d.isSame(m, 'day'));
  };

  isCustomDate: (date: Dayjs) => (string | boolean) = (date: Dayjs): string | boolean => {
    return (date.month() === 0 || date.month() === 6)
      ? 'mycustomdate'
      : false;
  };

  isTooltipDate: (m: Dayjs) => (string | boolean) = (m: Dayjs): string | boolean => {
    const tooltip: { date: Dayjs; text: string } | undefined = this.tooltips.find((tt: {
      date: Dayjs;
      text: string
    }): boolean => tt.date.isSame(m, 'day'));
    return tooltip ? tooltip.text : false;
  };

  datesUpdatedRange($event: Object) {
    console.log('range', $event);
  }

  datesUpdatedSingle($event: any) {
    console.log('single', $event);
  }

  datesUpdatedInline($event: Object) {
    console.log('inline', $event);
  }

}
