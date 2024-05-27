import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';

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
export class DatepickerComponent implements OnInit, AfterViewInit {
  // public value: Date = new Date(yyyy, MM, dd);
  @Output() datePicked = new EventEmitter();
  @Input() minDate: Date = new Date();
  @Input() maxDate: Date = new Date();

  ngOnInit(): void {
    
  }

  constructor(private renderer: Renderer2) {}

  public onChange(value: Date): void {
    this.datePicked.emit(value);
  }
  
  @ViewChild('datePicker') datePicker: ElementRef;

  ngAfterViewInit() {
    const inputElement = this.datePicker.nativeElement.querySelector('input');
    if (inputElement) {
      this.renderer.listen(inputElement, 'keydown', (event: KeyboardEvent) => {
        event.preventDefault();
      });
    }
  }
}
