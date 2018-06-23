import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FollowOrderPage } from './follow-order';

import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import { HttpClient } from '@angular/common/http';

import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    FollowOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(FollowOrderPage),
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
export class FollowOrderPageModule {}
