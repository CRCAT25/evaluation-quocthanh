import { Component, EventEmitter, Input, Output } from '@angular/core';


/**
 * - This is a button component have types: 'default' | 'success' | 'warning' | 'error' | 'info'
 * - Having 3 input options: classIcon, nameButton, type: string
 */
@Component({
  selector: 'component-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() classIcon: string = '';
  @Input() nameButton: string = '';
  @Input() type: 'default' | 'success' | 'warning' | 'error' | 'infor' = 'default';
}
