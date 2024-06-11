import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InEcomComponent } from './in-ecom.component';
import { Ecom001ChannelGroupComponent } from './pages/ecom001-channel-group/ecom001-channel-group.component';

const routes: Routes = [
  {
    path: '',
    component: InEcomComponent,
    children: [
      {
        path: '',
        redirectTo: 'ecom001-channel-group',
        pathMatch: 'full',
      },
      {
        path: 'ecom001-channel-group',
        component: Ecom001ChannelGroupComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PEcomRoutingModule {}
