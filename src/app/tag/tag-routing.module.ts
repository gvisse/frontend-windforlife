import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewTagComponent } from './components/new-tag/new-tag.component';
import { TagListComponent } from './components/tag-list/tag-list.component';
import { TagsResolver } from './resolvers/tags.resolver';

const routes: Routes = [
  { path: 'new', component: NewTagComponent},
  { path: '', component: TagListComponent, resolve: { tags: TagsResolver } }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagRoutingModule { }
