import { Component, OnInit } from '@angular/core';
import { BreadCrumbCollapseMode, BreadCrumbItem } from '@progress/kendo-angular-navigation';
import { ChannelGroupService } from '../../shared/services/channel-group.service';
import { DTOResponse } from 'src/app/in-lib/dto/dto.response';
import { DTOECOMChannelGroup } from '../../shared/dtos/DTOECOMChannelGroup';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-system-structure',
  templateUrl: './system-structure.component.html',
  styleUrls: ['./system-structure.component.scss']
})
export class SystemStructureComponent implements OnInit {
  // Variables
  collapseMode: BreadCrumbCollapseMode = 'none';
  imageIconModule: string = '../../../../../assets/image-site-map.svg';
  imageSiteMapDirection: string = '../../../../../assets/image-site-map.svg';
  isLoading: boolean = true;

  // List
  defaultItemsBreadCrumb: BreadCrumbItem[] = [
    {
      text: "Cấu trúc hệ thống",
    },
    {
      text: "Cấu trúc hệ thống",
    }
  ];
  itemsBreadCrumb: BreadCrumbItem[] = [...this.defaultItemsBreadCrumb];

  constructor() { }

  ngOnInit(): void {
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
