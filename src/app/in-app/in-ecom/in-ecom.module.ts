import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { InLayoutModule } from '../in-layout/in-layout.module';
import { InEcomComponent } from './in-ecom.component';
import { Ecom001ChannelGroupComponent } from './pages/ecom001-channel-group/ecom001-channel-group.component';
import { PEcomRoutingModule } from './in-ecom-routing.module';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { HamperBreadcrumb } from '../in-config/pages/shared/directives/HamperBreadcrumb.directive';
import { SetClassSVGIcon } from '../in-config/pages/shared/directives/SetClassSVGIcon.directive';
import { ButtonComponent } from './shared/components/button/button.component';



@NgModule({
  declarations: [
    InEcomComponent,
    Ecom001ChannelGroupComponent,
    HamperBreadcrumb,
    SetClassSVGIcon,
    ButtonComponent
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
