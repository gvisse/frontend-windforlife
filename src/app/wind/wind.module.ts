import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WindRoutingModule } from './wind-routing.module';
import { WindsService } from './services/winds.service';
import { WindListComponent } from './components/wind-list/wind-list.component';
import { WindListItemComponent } from './components/wind-list-item/wind-list-item.component';
import { SharedModule } from '../shared/shared.module';
import { WindAddComponent } from './components/wind-add/wind-add.component';
import { AnemometersService } from '../anemometer/services/anemometers.service';


@NgModule({
  declarations: [
    WindListComponent,
    WindListItemComponent,
    WindAddComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    WindRoutingModule
  ],
  exports: [
    WindAddComponent
  ],
  providers:[
    WindsService,
    AnemometersService
  ]
})
export class WindModule { }
