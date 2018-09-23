import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewRatesPage } from './view-rates';

import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    ViewRatesPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewRatesPage),
    Ionic2RatingModule 
  ],
})
export class ViewRatesPageModule {}
