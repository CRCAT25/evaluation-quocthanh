import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutDefaultComponent } from './layout-default/layout-default.component';
import { In_LayOutHelper } from './services/in-layout.helper';
import { ModuleDataAdmin } from './in-sitemaps/menu.data-admin';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'ecom/ecom001-channel-group',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutDefaultComponent,
    children: In_LayOutHelper.GetRoutes(ModuleDataAdmin)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InLayoutRoutingModule { }