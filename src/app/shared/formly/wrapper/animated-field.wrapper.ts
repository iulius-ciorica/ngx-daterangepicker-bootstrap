import {Component} from '@angular/core';
import {
  FieldWrapper,
  FormlyFieldConfig,
  FormlyFieldProps as CoreFormlyFieldProps,
  FormlyModule
} from '@ngx-formly/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {NgTemplateOutlet} from "@angular/common";

export interface FormlyFieldProps extends CoreFormlyFieldProps {
  hideLabel?: boolean;
  hideRequiredMarker?: boolean;
  labelPosition?: 'floating';
  toolTip: any;
}

@Component({
  selector: 'formly-wrapper-form-field',
  template: `
    <ng-template #labelTemplate>
      @if (props.label && props.hideLabel !== true) {
        <label [attr.for]="id" class="form-label">
          {{ props.label }}
          @if (props.required && props.hideRequiredMarker !== true) {
            <span aria-hidden="true">*</span>
          }
        </label>
      }
    </ng-template>

    <div class="mb-3" [class.form-floating]="props.labelPosition === 'floating'" [class.has-error]="showError">
      @if (props.labelPosition !== 'floating') {
        <ng-container>
          <ng-container [ngTemplateOutlet]="labelTemplate"></ng-container>
        </ng-container>
      }

      <div>
        <ng-template #fieldComponent></ng-template>
      </div>

      @if (props.labelPosition === 'floating') {
        <ng-container>
          <ng-container [ngTemplateOutlet]="labelTemplate"></ng-container>
        </ng-container>
      }

      @if (showError) {
        <div @slideDownUp class="invalid-feedback" [style.display]="'block'">
          <formly-validation-message [field]="field"></formly-validation-message>
        </div>
      }
      @if (props.description) {
        <small class="form-text text-muted">{{ props.description }}</small>
      }
    </div>
  `,
  animations: [
    trigger('slideDownUp', [
      transition(':enter', [
        style({
          opacity: '0',
          overflow: 'hidden',
          height: '0px',
        }),
        animate(250, style({
          opacity: '1',
          overflow: 'hidden',
          height: '*',
        }))
      ]),
      transition(':leave', [
        style({
          opacity: '1',
          overflow: 'hidden',
          height: '*',
        }),
        animate(250, style({
          opacity: '0',
          overflow: 'hidden',
          height: '0px',
        }))
      ])
    ]),
  ],
  imports: [
    NgTemplateOutlet,
    FormlyModule,
  ],
  standalone: true
})
export class AnimatedFieldWrapper extends FieldWrapper<FormlyFieldConfig<FormlyFieldProps>> {
}
