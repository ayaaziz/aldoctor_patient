import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RemaingTimeForPlcPage } from './remaing-time-for-plc';

import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    RemaingTimeForPlcPage,
  ],
  imports: [
    IonicPageModule.forChild(RemaingTimeForPlcPage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class RemaingTimeForPlcPageModule {}
