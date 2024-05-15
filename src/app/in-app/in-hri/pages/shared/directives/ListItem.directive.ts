import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
    selector: '[listItemDirective]',
})

export class ListItemDirective implements OnInit {
    constructor(private element: ElementRef) { }
    ngOnInit(): void {
        const element = this.element.nativeElement as HTMLElement;
        if (element) {
            console.log(element);
            // const gridElement = element.querySelector('.k-grid-aria-root');
            // if (gridElement) {
            //     console.log(gridElement);
            //     const gridContainerElement = gridElement.getElementsByClassName('k-table-th');
            //     if(gridContainerElement){
            //         console.log(gridContainerElement.length);

            //     }
            //     // Kiểm tra nếu HTMLCollection không rỗng
            //     if (gridContainerElement.length > 0) {
            //         // Lấy phần tử tại index 0
            //         const firstElement = gridContainerElement[0] as HTMLElement;
            //         console.log(firstElement);
            //     }
            // }
        }
    }
}