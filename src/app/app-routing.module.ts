import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from './in-app/in-hri/shared/components/user-login/user-login.component';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../app/in-app/in-layout/in-layout.module').then(m => m.InLayoutModule)
  },
  {
    path: 'user-login',
    component: UserLoginComponent  // Định tuyến đến UserLoginComponent
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
