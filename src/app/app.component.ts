import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import dayjs, {Dayjs} from "dayjs";
import {FormsModule} from "@angular/forms";
import {
  NgxDaterangepickerBootstrapDirective
} from "../../projects/ngx-daterangepicker-bootstrap/src/lib/directives/ngx-daterangepicker-bootstrap.directive";
import {
  NgxDaterangepickerBootstrapComponent
} from "../../projects/ngx-daterangepicker-bootstrap/src/lib/components/daterangepicker/ngx-daterangepicker-bootstrap.component";
import {
  NgxDaterangepickerBootstrapModule
} from "../../projects/ngx-daterangepicker-bootstrap/src/lib/modules/ngx-daterangepicker-bootstrap.module";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, NgxDaterangepickerBootstrapDirective, NgxDaterangepickerBootstrapComponent],
  // imports: [RouterOutlet, FormsModule, NgxDaterangepickerBootstrapModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'daterangepicker-bootstrap-sdk';
  dropsDown = 'down';
  dropsUp = 'up';
  opensRight = 'right';
  opensCenter = 'center';
  opensLeft = 'left';
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
  localeTime = {
    firstDay: 1,
    startDate: dayjs().startOf('day'),
    endDate: dayjs().endOf('day'),
    format: 'DD.MM.YYYY HH:mm:ss',
    applyLabel: 'Apply',
    cancelLabel: 'Cancel',
    fromLabel: 'From',
    toLabel: 'To',
  };
  locale = {
    firstDay: 1,
    startDate: dayjs().startOf('day'),
    endDate: dayjs().endOf('day'),
    format: 'DD.MM.YYYY',
    applyLabel: 'Apply',
    cancelLabel: 'Cancel',
    fromLabel: 'From',
    toLabel: 'To',
  };
  tooltips = [
    {date: dayjs(), text: 'Today is just unselectable'},
    {date: dayjs().add(2, 'days'), text: 'Yeeeees!!!'}
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

  isInvalidDate = (m: Dayjs) => {
    return this.invalidDates.some(d => d.isSame(m, 'day'));
  };

  isCustomDate = (date: Dayjs) => {
    return (date.month() === 0 || date.month() === 6)
      ? 'mycustomdate'
      : false;
  };

  isTooltipDate = (m: Dayjs) => {
    const tooltip = this.tooltips.find(tt => tt.date.isSame(m, 'day'));
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
