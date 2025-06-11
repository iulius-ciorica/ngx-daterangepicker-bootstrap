import {ChangeDetectionStrategy, Component, input, output, OutputEmitterRef} from '@angular/core';

@Component({
  selector: 'actions',
  imports: [],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsComponent {

  readonly rangesArray = input<Array<any>>([]);
  readonly autoApply = input<any>();
  readonly showCalInRanges = input<any>();
  readonly singleDatePicker = input<any>();
  readonly chosenLabel = input<any>();
  readonly applyBtnDisabled = input<any>();
  readonly locale = input<any>();
  readonly showCancel = input<any>();
  readonly showClearButton = input<any>();
  readonly applyEvent: OutputEmitterRef<MouseEvent> = output();
  readonly cancelEvent: OutputEmitterRef<MouseEvent> = output();
  readonly clearEvent: OutputEmitterRef<MouseEvent> = output();

  clickApply($event: any) {
    this.applyEvent.emit($event)
  }

  clickCancel($event: any) {
    this.cancelEvent.emit($event)
  }

  clickClear($event: any) {
    this.clearEvent.emit($event)
  }

}
