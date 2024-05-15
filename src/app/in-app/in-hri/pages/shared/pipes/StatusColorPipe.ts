import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusColor'
})

/**
 * StatusColorPipe using for change style color base on text status
 * Using example: 
 * In file ts: Create variable status: string = 'Đang soạn thảo' or something else
 * In file html: <div [style.color]="status | statusColor">{{ status }}</div>
 */
export class StatusColorPipe implements PipeTransform {
  transform(status: string): string {
    switch (status) {
      case 'Đang soạn thảo':
        return '#23282c'; 
      case 'Gởi duyệt':
        return '#008cd7'; 
      case 'Duyệt áp dụng':
        return '#316e00'; 
      case 'Ngưng áp dụng':
        return '#eb273a';
      case 'Trả về':
        return '#ffb900';
      default:
        return 'black';
    }
  }
}