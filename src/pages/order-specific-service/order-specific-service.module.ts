import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderSpecificServicePage } from './order-specific-service';

import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import { HttpClient } from '@angular/common/http';

import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    OrderSpecificServicePage,
  ],
  imports: [
    IonicPageModule.forChild(OrderSpecificServicePage),
    Ionic2RatingModule ,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class OrderSpecificServicePageModule {}
