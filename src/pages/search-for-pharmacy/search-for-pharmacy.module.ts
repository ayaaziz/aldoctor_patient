import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchForPharmacyPage } from './search-for-pharmacy';


import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    SearchForPharmacyPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchForPharmacyPage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class SearchForPharmacyPageModule {}
