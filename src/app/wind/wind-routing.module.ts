import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WindListComponent } from './components/wind-list/wind-list.component';
import { WindAddComponent } from './components/wind-add/wind-add.component';

const routes: Routes = [
  { path: 'new/:id', component: WindAddComponent },
  { path: 'new', component: WindAddComponent },
  { path: '', component: WindListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WindRoutingModule { }
