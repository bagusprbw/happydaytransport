import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TroliPageRoutingModule } from './troli-routing.module';

import { TroliPage } from './troli.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TroliPageRoutingModule
  ],
  declarations: [TroliPage]
})
export class TroliPageModule {}
