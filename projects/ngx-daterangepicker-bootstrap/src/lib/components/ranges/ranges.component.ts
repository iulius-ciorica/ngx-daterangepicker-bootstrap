import {ChangeDetectionStrategy, Component, input, InputSignal, output, OutputEmitterRef} from '@angular/core';
import {NgClass} from '@angular/common';
import {Dayjs} from 'dayjs';

@Component({
  selector: 'ranges',
  imports: [
    NgClass
  ],
  templateUrl: './ranges.component.html',
  styleUrl: './ranges.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangesComponent {

  readonly rangesArray: InputSignal<Array<any> | undefined> = input<Array<any>>();
  readonly chosenRange: InputSignal<any> = input<any>();
  readonly locale: InputSignal<any> = input<any>();
  readonly ranges: InputSignal<any> = input<any>();
  readonly minDate: InputSignal<Dayjs | null | undefined> = input<Dayjs | null | undefined>();
  readonly maxDate: InputSignal<Dayjs | null | undefined> = input<Dayjs | null | undefined>();
  readonly rangeEvent: OutputEmitterRef<{ $event: MouseEvent, label: string }> = output();

  clickRange($event: MouseEvent, label: string): void {
    this.rangeEvent.emit({$event: $event, label: label})
  }

  /**
   * Find out if the selected range should be disabled if it doesn't
   * fit into minDate and maxDate limitations.
   */
  disableRange(range: any): boolean {
    if (range === this.locale().customRangeLabel) {
      return false;
    }
    const rangeMarkers: any = this.ranges()[range];
    const areBothBefore: boolean = rangeMarkers.every((date: Dayjs): boolean => {
      if (!this.minDate()) {
        return false;
      }
      return date.isBefore(this.minDate());
    });
    const areBothAfter: boolean = rangeMarkers.every((date: Dayjs): boolean => {
      if (!this.maxDate()) {
        return false;
      }
      return date.isAfter(this.maxDate());
    });
    return (areBothBefore || areBothAfter);
  }

}
