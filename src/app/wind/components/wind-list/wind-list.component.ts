import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

import { Observable, map, tap } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { Wind } from '../../models/wind.model';
import { WindsService } from '../../services/winds.service';

@Component({
  selector: 'app-wind-list',
  templateUrl: './wind-list.component.html',
  styleUrls: ['./wind-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WindListComponent implements OnInit {

  loading$!: Observable<boolean>;
  winds$!: Observable<Wind[]>;
  countWinds$!: Observable<number>;

  pageEvent!: PageEvent;
  length!: number;
  pageSize!: number;
  pageIndex!: number;
  pageSizeOptions = [10, 25, 50, 100];
  showPageSizeOptions = true;
  showFirstLastButtons = true;


  constructor(private windsService: WindsService, public authService: AuthService){ }

  ngOnInit(): void {
    this.initObservable();
    this.windsService.getWindsFromServeur();
  }

  private initObservable(){
    this.loading$ = this.windsService.loading$;
    this.winds$ = this.windsService.winds$;
    this.countWinds$ = this.windsService.countWinds$;
  }

  onCreateWind(createdWind: {speed: number, time: Date, anemometer_id:number}){
    this.windsService.createWind(createdWind);
  }

  onDeleteWind(wind_id:number){
    this.windsService.deleteWind(wind_id);
  }

  onChangePage(e:PageEvent){
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.windsService.goToPage(undefined, {page: e.pageIndex+1, size: e.pageSize});
  }
}
