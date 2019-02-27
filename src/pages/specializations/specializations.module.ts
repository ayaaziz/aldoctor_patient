import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpecializationsPage } from './specializations';


import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import { HttpClient } from '@angular/common/http';

import { Ionic2RatingModule } from 'ionic2-rating';



@NgModule({
  declarations: [
    SpecializationsPage,
  ],
  imports: [
    IonicPageModule.forChild(SpecializationsPage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),

  ],
})
export class SpecializationsPageModule {}
