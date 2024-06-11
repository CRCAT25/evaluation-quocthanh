import { Component } from '@angular/core';
import { BreadCrumbCollapseMode, BreadCrumbItem } from '@progress/kendo-angular-navigation';

@Component({
  selector: 'app-ecom001-channel-group',
  templateUrl: './ecom001-channel-group.component.html',
  styleUrls: ['./ecom001-channel-group.component.scss']
})
export class Ecom001ChannelGroupComponent {
  // Variables
  collapseMode: BreadCrumbCollapseMode = 'none';
  imageSiteMapDirection: string = '../../../../../assets/image-site-map.svg';

  // List
  defaultItemsBreadCrumb: BreadCrumbItem[] = [
    {
      text: "Kênh bán hàng",
    },
    {
      text: "Nhóm kênh bán hàng",
    }
  ];
  itemsBreadCrumb: BreadCrumbItem[] = [...this.defaultItemsBreadCrumb];
}
