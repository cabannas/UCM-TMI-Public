import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeelsicPage } from './feelsic.page';

import { FeelsicPageRoutingModule } from './feelsic-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    FeelsicPageRoutingModule
  ],
  declarations: [FeelsicPage]
})
export class FeelsicPageModule {}
