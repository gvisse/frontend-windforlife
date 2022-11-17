import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WindListComponent } from './components/wind-list/wind-list.component';

const routes: Routes = [
  { path: '', component: WindListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WindRoutingModule { }
