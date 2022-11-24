import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TagListComponent } from './components/tag-list/tag-list.component';
import { TagUpdateComponent } from './components/tag-update/tag-update.component';

const routes: Routes = [
  { path: ':id/update', component: TagUpdateComponent },
  { path: '', component: TagListComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagRoutingModule { }
