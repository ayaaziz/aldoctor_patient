import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderServicePage } from './order-service';

@NgModule({
  declarations: [
    OrderServicePage,
  ],
  imports: [
    IonicPageModule.forChild(OrderServicePage),
  ],
})
export class OrderServicePageModule {}
