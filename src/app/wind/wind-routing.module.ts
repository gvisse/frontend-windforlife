import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WindListComponent } from './components/wind-list/wind-list.component';
import { WindAddComponent } from './components/wind-add/wind-add.component';
import { AuthGuard } from '../core/guards/auth.guards';

const routes: Routes = [
  { path: 'new/:id', component: WindAddComponent, canActivate: [AuthGuard]},
  { path: 'new', component: WindAddComponent, canActivate: [AuthGuard]},
  { path: '', component: WindListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WindRoutingModule { }
