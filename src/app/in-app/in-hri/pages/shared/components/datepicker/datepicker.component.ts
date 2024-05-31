import { Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { DatePickerComponent } from '@progress/kendo-angular-dateinputs';

/**
 * This component provide user a customized datepicker from kendo
 * Having 2 input: minDate, maxDate
 * Having 1 output: datePicked(date is picked)
 */
@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {
  // public value: Date = new Date(yyyy, MM, dd);
  @Output() datePicked = new EventEmitter();
  @Input() minDate: Date = new Date();
  @Input() maxDate: Date = new Date();
  @ViewChild('datePicker', { static: false }) datePicker!: DatePickerComponent;
  valueDate: Date = null;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    
  }

  public onChange(value: Date): void {
    this.datePicked.emit(value);
  }

  resetDate(){
    this.valueDate = null
    this.datePicker.writeValue(null);
  }

  onOpenDatePicker(){
    const body = this.renderer.selectRootElement('body', true) as HTMLElement;
    const rootElement = body.querySelector('app-root') as HTMLElement;
    const popupElement = rootElement.querySelector('kendo-popup');
    console.log(body);
    console.log(popupElement);
  }

}
