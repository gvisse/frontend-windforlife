import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guards';
import { TagListComponent } from './components/tag-list/tag-list.component';
import { TagUpdateComponent } from './components/tag-update/tag-update.component';

const routes: Routes = [
  { path: ':id/update', component: TagUpdateComponent, canActivate: [AuthGuard]},
  { path: '', component: TagListComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagRoutingModule { }
