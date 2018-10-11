import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComplaintsPage } from './complaints';

import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import { HttpClient } from '@angular/common/http';


@NgModule({
  declarations: [
    ComplaintsPage,
  ],
  imports: [
    IonicPageModule.forChild(ComplaintsPage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class ComplaintsPageModule {}
