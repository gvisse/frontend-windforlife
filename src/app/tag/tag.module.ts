import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagRoutingModule } from './tag-routing.module';
import { TagsService } from './services/tags.service';
import { TagListComponent } from './components/tag-list/tag-list.component';
import { TagListItemComponent } from './components/tag-list-item/tag-list-item.component';
import { SharedModule } from '../shared/shared.module';
import { NewTagComponent } from './components/new-tag/new-tag.component';
import { TagUpdateComponent } from './components/tag-update/tag-update.component';


@NgModule({
  declarations: [
    TagListComponent,
    TagListItemComponent,
    NewTagComponent,
    TagUpdateComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TagRoutingModule
  ],
  exports : [
    TagListComponent,
    TagListItemComponent
  ],
  providers:[
    TagsService
  ]
})
export class TagModule { }
