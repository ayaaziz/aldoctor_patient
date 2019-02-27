import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RemainingTimeToAcceptPage } from './remaining-time-to-accept';

import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import { HttpClient } from '@angular/common/http';


@NgModule({
  declarations: [
    RemainingTimeToAcceptPage,
  ],
  imports: [
    IonicPageModule.forChild(RemainingTimeToAcceptPage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class RemainingTimeToAcceptPageModule {}
