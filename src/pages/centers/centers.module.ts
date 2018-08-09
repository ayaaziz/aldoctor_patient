import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CentersPage } from './centers';

@NgModule({
  declarations: [
    CentersPage,
  ],
  imports: [
    IonicPageModule.forChild(CentersPage),
  ],
})
export class CentersPageModule {}
