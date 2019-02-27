import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchForDoctorPage } from './search-for-doctor';


import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    SearchForDoctorPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchForDoctorPage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class SearchForDoctorPageModule {}
