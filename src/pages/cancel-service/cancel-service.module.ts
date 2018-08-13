import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CancelServicePage } from './cancel-service';


import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    CancelServicePage,
  ],
  imports: [
    IonicPageModule.forChild(CancelServicePage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })

  ],
})
export class CancelServicePageModule {}
