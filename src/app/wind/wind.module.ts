import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WindRoutingModule } from './wind-routing.module';
import { WindsService } from './services/winds.service';
import { WindListComponent } from './components/wind-list/wind-list.component';
import { WindListItemComponent } from './components/wind-list-item/wind-list-item.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    WindListComponent,
    WindListItemComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    WindRoutingModule
  ],
  providers:[
    WindsService,
  ]
})
export class WindModule { }
