import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InEcomComponent } from './in-ecom.component';
import { SystemStructureComponent } from './pages/system-structure/system-structure.component';

const routes: Routes = [
  {
    path: '',
    component: InEcomComponent,
    children: [
      {
        path: '',
        redirectTo: 'system-structure',
        pathMatch: 'full',
      },
      {
        path: 'system-structure',
        component: SystemStructureComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PEcomRoutingModule {}
