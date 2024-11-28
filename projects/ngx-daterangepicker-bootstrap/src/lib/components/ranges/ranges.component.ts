import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Dayjs} from 'dayjs';
import {NgClass} from '@angular/common';

@Component({
  selector: 'ranges',
  imports: [
    NgClass
  ],
  templateUrl: './ranges.component.html',
  styleUrl: './ranges.component.scss'
})
export class RangesComponent {

  @Input() rangesArray: Array<any> = [];
  @Input() chosenRange: any;
  @Input() locale: any;
  @Input() ranges: any;
  @Input() _minDate: any;
  @Input() _maxDate: any;
  @Output() rangeEvent: EventEmitter<{ $event: MouseEvent, label: string }> = new EventEmitter();

  clickRange($event: MouseEvent, label: string) {
    this.rangeEvent.emit({$event: $event, label: label})
  }

  /**
   * Find out if the selected range should be disabled if it doesn't
   * fit into minDate and maxDate limitations.
   */
  disableRange(range: any) {
    if (range === this.locale.customRangeLabel) {
      return false;
    }
    const rangeMarkers = this.ranges[range];
    const areBothBefore = rangeMarkers.every((date: any) => {
      if (!this.getMinDate()) {
        return false;
      }
      return date.isBefore(this.getMinDate());
    });
    const areBothAfter = rangeMarkers.every((date: any) => {
      if (!this.getMaxDate()) {
        return false;
      }
      return date.isAfter(this.getMaxDate());
    });
    return (areBothBefore || areBothAfter);
  }

  getMinDate(): Dayjs | null | undefined {
    return this._minDate;
  }

  getMaxDate(): Dayjs | null | undefined {
    return this._maxDate;
  }

}
