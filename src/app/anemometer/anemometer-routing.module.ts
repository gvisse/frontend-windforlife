import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnemometerListComponent } from './components/anemometer-list/anemometer-list.component';
import { SingleAnemometerComponent } from './components/single-anemometer/single-anemometer.component';
import { AnemometerNewComponent } from './components/anemometer-new/anemometer-new.component';
import { AnemometerUpdateComponent } from './components/anemometer-update/anemometer-update.component';

const routes: Routes = [
  { path: 'new', component: AnemometerNewComponent},
  { path: ':id/update', component: AnemometerUpdateComponent },
  { path: ':id', component: SingleAnemometerComponent },
  { path: '', component: AnemometerListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnemometerRoutingModule { }
