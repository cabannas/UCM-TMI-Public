import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeelsicPage } from './feelsic.page';

const routes: Routes = [
  {
    path: '',
    component: FeelsicPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeelsicPageRoutingModule {}
