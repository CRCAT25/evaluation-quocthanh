import { Component, OnInit } from '@angular/core';
import { BreadCrumbCollapseMode, BreadCrumbItem } from '@progress/kendo-angular-navigation';
import { ChannelGroupService } from '../../shared/services/channel-group.service';
import { DTOResponse } from 'src/app/in-lib/dto/dto.response';
import { DTOECOMChannelGroup } from '../../shared/dtos/DTOECOMChannelGroup';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-ecom001-channel-group',
  templateUrl: './ecom001-channel-group.component.html',
  styleUrls: ['./ecom001-channel-group.component.scss']
})
export class Ecom001ChannelGroupComponent implements OnInit {
  // Variables
  collapseMode: BreadCrumbCollapseMode = 'none';
  imageSiteMapDirection: string = '../../../../../assets/image-site-map.svg';
  isLoading: boolean = true;

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
  listOriginChannelGroup: DTOECOMChannelGroup[] = [];

  constructor(private channelgroupService: ChannelGroupService) { }

  ngOnInit(): void {
    this.getListOriginChannelGroup();
  }

  getListOriginChannelGroup() {
    this.channelgroupService.GetListChannelGroup({}).subscribe((res: DTOResponse) => {
      if (res.ObjectReturn) {
        this.listOriginChannelGroup = [...res.ObjectReturn];
        console.log(this.listOriginChannelGroup);
        this.isLoading = false;
      }
    })
  }

  fetchChildren = (item: any): Observable<any[]> => {
    if (item.ListGroup) {
      return of(item.ListGroup);
    }
    return of([]);
  };


  hasChildren = (item: any): boolean => {
    return item.ListGroup?.length > 0;
  };

}
