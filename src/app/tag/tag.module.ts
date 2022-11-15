import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagRoutingModule } from './tag-routing.module';
import { TagsService } from './services/tags.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TagRoutingModule
  ],
  providers:[
    TagsService
  ]
})
export class TagModule { }
