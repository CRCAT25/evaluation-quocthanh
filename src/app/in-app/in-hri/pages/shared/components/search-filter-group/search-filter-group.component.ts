import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

/**
 * Component provide user box search with input text box and button search
 * 
 */
@Component({
  selector: 'app-search-filter-group',
  templateUrl: './search-filter-group.component.html',
  styleUrls: ['./search-filter-group.component.scss']
})
export class SearchFilterGroupComponent {
  @Output() getValue = new EventEmitter<string>();
  @Output() resetValue = new EventEmitter<string>();
  textboxValue: string = '';

  element = this.elementRef.nativeElement as HTMLElement;

  constructor(private elementRef: ElementRef) { }

  getInputValue(){
    this.getValue.emit(this.textboxValue);
  }

  public onChangeTextBox(value: string): void {
    this.textboxValue = value;
  }

  onClickInput() {
    const inputElement = this.element.querySelector('.input-search-button');
    inputElement.classList.add('focus');
  }

  resetFilter(){
    this.textboxValue = ''
    this.resetValue.emit('');
  }

  // Sự kiện khi click ra ngoài màn hình
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    // Kiểm tra xem phần tử được click có phải là other-pro_status_tool hay không
    if (!(event.target as HTMLElement).closest('.focus')) {
      const inputElement = this.element.querySelector('.input-search-button');
    inputElement.classList.remove('focus');
    }
  }
}
