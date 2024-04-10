import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { ApiService } from '../api.service';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'login',
        loadChildren: () => import('../login/login.module').then(m => m.LoginPageModule)
      },
      {
        path: 'main',
        loadChildren: () => import('../main/main.module').then(m => m.MainPageModule)
      },
      {
        path: 'feelsic',
        loadChildren: () => import('../feelsic/feelsic.module').then(m => m.FeelsicPageModule)
      },
      {
        path: 'feelsic/:id',
        loadChildren: () => import('../feelsic/feelsic.module').then(m => m.FeelsicPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/main',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
