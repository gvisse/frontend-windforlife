import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Observable, map } from 'rxjs';
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
  winds$!: Observable<Wind[]>

  constructor(private windsService: WindsService) { }

  ngOnInit(): void {
    this.initObservable();
    this.windsService.getWindsFromServeur();
  }

  private initObservable(){
    this.loading$ = this.windsService.loading$;
    this.winds$ = this.windsService.winds$;
  }

  onCreateWind(createdWind: {speed: number, time: Date, anemometer_id:number}){
    this.windsService.createWind(createdWind);
  }

}
