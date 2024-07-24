import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { InLayoutModule } from '../in-layout/in-layout.module';
import { InEcomComponent } from './in-ecom.component';
import { SystemStructureComponent } from './pages/system-structure/system-structure.component';
import { PEcomRoutingModule } from './in-ecom-routing.module';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { HamperBreadcrumb } from '../in-config/pages/shared/directives/HamperBreadcrumb.directive';
import { SetClassSVGIcon } from '../in-config/pages/shared/directives/SetClassSVGIcon.directive';
import { ButtonComponent } from './shared/components/button/button.component';
import { PagerGridDirective } from './shared/directives/pagergrid.directive';
import { TextInputComponent } from './shared/components/text-input/text-input.component';
import { SearchBarComponent } from './shared/components/search-bar/search-bar.component';



@NgModule({
  declarations: [
    InEcomComponent,
    SystemStructureComponent,
    HamperBreadcrumb,
    SetClassSVGIcon,
    ButtonComponent,
    PagerGridDirective,
    TextInputComponent,
    SearchBarComponent
  ],
  imports: [
    PEcomRoutingModule,
    InLayoutModule,
    InputsModule,
    LabelModule,
    ButtonModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  providers: [],

})
export class InEcomModule {}
