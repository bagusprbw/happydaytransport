import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HalamanPageRoutingModule } from './halaman-routing.module';

import { HalamanPage } from './halaman.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HalamanPageRoutingModule
  ],
  declarations: [HalamanPage]
})
export class HalamanPageModule {}
