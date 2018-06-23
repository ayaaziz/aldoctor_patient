import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoctorEvaluationPage } from './doctor-evaluation';

@NgModule({
  declarations: [
    DoctorEvaluationPage,
  ],
  imports: [
    IonicPageModule.forChild(DoctorEvaluationPage),
  ],
})
export class DoctorEvaluationPageModule {}
