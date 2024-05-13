import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { InLayoutModule } from '../in-layout/in-layout.module';
import { PHriRoutingModule } from './in-hri-routing.module';
import { InHriComponent } from './in-hri.component';
import { SetClassSVGIcon } from './pages/shared/directives/SetClassSVGIcon.directive';
import { HamperBreadcrumb } from './pages/shared/directives/HamperBreadcrumb.directive';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { Necessary } from './pages/shared/directives/Necessary.directive';
import { PricePipe } from './pages/shared/pipes/PricePipe.pipe';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { IconModule } from '@progress/kendo-angular-icons';
import { StatusColorPipe } from './pages/shared/pipes/StatusColorPipe';
import { DialogComponent } from './pages/shared/components/dialog/dialog.component';
import { DialogDirective } from './pages/shared/directives/dialog.directive';
import { Hri001EvaluationListComponent } from './pages/hri001-evaluation-list/hri001-evaluation-list.component';
import { CheckboxlistComponent } from './pages/shared/components/checkboxlist/checkboxlist.component';
import { ButtonComponent } from './pages/shared/components/button/button.component';
import { DatepickerComponent } from './pages/shared/components/datepicker/datepicker.component';
import { DatepickerKendo } from './pages/shared/directives/datepicker-kendo.directive';
import { SearchFilterGroupComponent } from './pages/shared/components/search-filter-group/search-filter-group.component';
import { EvaluationService } from './pages/shared/services/evaluation.service';



@NgModule({
  declarations: [
    InHriComponent,
    Hri001EvaluationListComponent,
    SetClassSVGIcon,
    HamperBreadcrumb,
    Necessary,
    PricePipe,
    StatusColorPipe,
    DialogComponent,
    DialogDirective,
    CheckboxlistComponent,
    ButtonComponent,
    DatepickerComponent,
    DatepickerKendo,
    SearchFilterGroupComponent,
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
  providers: [EvaluationService],

})
export class InHriModule {}
