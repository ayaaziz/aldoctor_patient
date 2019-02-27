import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutAppPage } from './about-app';

import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import { HttpClient } from '@angular/common/http';


@NgModule({
  declarations: [
    AboutAppPage,
  ],
  imports: [
    IonicPageModule.forChild(AboutAppPage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class AboutAppPageModule {}
