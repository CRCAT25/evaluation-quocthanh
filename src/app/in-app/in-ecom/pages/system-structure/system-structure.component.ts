import { Component, OnInit } from '@angular/core';
import { BreadCrumbCollapseMode, BreadCrumbItem } from '@progress/kendo-angular-navigation';
import { Observable, of } from 'rxjs';
import { DTOGroup } from '../../shared/dtos/DTOModule.dto';
import { DTOResponse } from 'src/app/in-lib/dto/dto.response';
import { listDataTemp } from '../../shared/services/datatemp';

@Component({
  selector: 'app-system-structure',
  templateUrl: './system-structure.component.html',
  styleUrls: ['./system-structure.component.scss']
})
export class SystemStructureComponent implements OnInit {
  // Variables
  // Chế độ của breadcrumb
  collapseMode: BreadCrumbCollapseMode = 'none';
  // Icon group
  imageIconGroup: string = '../../../../../assets/image-group.svg';
  // Icon function
  imageIconFunction: string = '../../../../../assets/image-function.svg';
  // Icon action
  imageIconAction: string = '../../../../../assets/image-action.svg';
  // Loading của list
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
  listSysStructure: DTOGroup[];

  constructor() { }

  ngOnInit(): void {
    this.getListOriginSysStructure();
  }

  // Lấy danh sách cấu trúc hệ thống
  getListOriginSysStructure() {
    const data: any = listDataTemp;
    if(data.StatusCode == 0){
      this.listSysStructure = data.ObjectReturn;
    }
  }

  fetchChildren = (item: any): Observable<any[]> => {
    if (item.ListAction) {
      return of(item.ListAction);
    }
    if (item.ListFunctions) {
      return of(item.ListFunctions);
    }
    if (item.ListGroup) {
      return of(item.ListGroup);
    }
    return of([]);
  };


  hasChildren = (item: any): boolean => {
    return item.ListGroup?.length > 0 || item.ListFunctions?.length > 0 || item.ListAction?.length > 0;
  };
}
