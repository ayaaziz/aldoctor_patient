import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderSpecificServicePage } from './order-specific-service';

@NgModule({
  declarations: [
    OrderSpecificServicePage,
  ],
  imports: [
    IonicPageModule.forChild(OrderSpecificServicePage),
  ],
})
export class OrderSpecificServicePageModule {}
