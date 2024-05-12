import { Directive, ElementRef, OnInit } from '@angular/core';

/** Necessary
 * - Using for datepicker of kendo
 * - Example ( <kendo-datepicker datepicker-kendo calendarType="infinite" [value]="value" />)
 **/

@Directive({
    selector: '[datepicker-kendo]',
})

export class DatepickerKendo implements OnInit {
    constructor(private element: ElementRef) { }
    ngOnInit(): void {
        const element = this.element.nativeElement as HTMLElement;
        if (element) {
            const iconElement = element.querySelector('button kendo-icon-wrapper')
            iconElement.innerHTML = `
                <span class="k-icon k-font-icon k-i-calendar"></span>
            `
        }
    }
}