import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CentersPage } from './centers';

import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import { HttpClient } from '@angular/common/http';


@NgModule({
  declarations: [
    CentersPage,
  ],
  imports: [
    IonicPageModule.forChild(CentersPage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class CentersPageModule {}
