import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { InLayoutModule } from '../in-layout/in-layout.module';
import { PHriRoutingModule } from './in-hri-routing.module';
import { InHriComponent } from './in-hri.component';
import { ItemCompanyComponent } from './pages/shared/components/item-company/item-company.component';
import { HamperButtons } from './pages/shared/directives/HamperButtons.directive';
import { SetClassSVGIcon } from './pages/shared/directives/SetClassSVGIcon.directive';
import { ImportImageComponent } from './pages/shared/components/import-image/import-image.component';
import { HamperBreadcrumb } from './pages/shared/directives/HamperBreadcrumb.directive';
import { FileSelected } from './pages/shared/directives/FileSelected.directive';
import { ProductListComponent } from './pages/shared/components/product-list/product-list.component';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { Necessary } from './pages/shared/directives/Necessary.directive';
import { PricePipe } from './pages/shared/pipes/PricePipe.pipe';
import { HamperDrawerComponent } from './pages/shared/components/hamperdrawer/drawer.component';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { IconModule } from '@progress/kendo-angular-icons';
import { StatusColorPipe } from './pages/shared/pipes/StatusColorPipe';
import { DialogComponent } from './pages/shared/components/dialog/dialog.component';
import { DialogDirective } from './pages/shared/directives/dialog.directive';
import { Hri001EvaluationListComponent } from './pages/hri001-evaluation-list/hri001-evaluation-list.component';
import { CheckboxlistComponent } from './pages/shared/components/checkboxlist/checkboxlist.component';



@NgModule({
  declarations: [
    InHriComponent,
    Hri001EvaluationListComponent,
    ItemCompanyComponent,
    HamperButtons,
    SetClassSVGIcon,
    ImportImageComponent,
    ProductListComponent,
    HamperBreadcrumb,
    FileSelected,
    ProductListComponent,
    Necessary,
    PricePipe,
    HamperDrawerComponent,
    StatusColorPipe,
    DialogComponent,
    DialogDirective,
    CheckboxlistComponent,
  ],
  imports: [
    PHriRoutingModule,
    InLayoutModule,
    InputsModule,
    LabelModule,
    ButtonModule,
    IconModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],

})
export class InHriModule {}
