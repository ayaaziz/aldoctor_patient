import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NursingStayAndWoundCarePage } from './nursing-stay-and-wound-care';


import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    NursingStayAndWoundCarePage,
  ],
  imports: [
    IonicPageModule.forChild(NursingStayAndWoundCarePage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class NursingStayAndWoundCarePageModule {}
