import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, switchMap, take, tap } from 'rxjs';
import { Wind } from 'src/app/wind/models/wind.model';
import { WindsService } from 'src/app/wind/services/winds.service';
import { Anemometer } from '../../models/anemometer.model';
import { AnemometersService } from '../../services/anemometers.service';

@Component({
  selector: 'app-single-anemometer',
  templateUrl: './single-anemometer.component.html',
  styleUrls: ['./single-anemometer.component.scss']
})
export class SingleAnemometerComponent implements OnInit {

  loading$!: Observable<boolean>;
  loadingWinds$!: Observable<boolean>;
  anemometer$!: Observable<Anemometer>;
  winds$!: Observable<Wind[]>;
  countWinds$!: Observable<number>;

  winds!: Wind[];
  sortedWinds!: Wind[];

  panelOpenState = true;

  constructor(private anemometersService: AnemometersService,
              private windsService: WindsService,
              private route: ActivatedRoute,
              private router: Router){}

  ngOnInit(): void {
      this.initObservables();
  }

  private initObservables() {
      this.loading$ = this.anemometersService.loading$;
      this.loadingWinds$ = this.windsService.loading$;
      this.anemometer$ = this.route.params.pipe(
        switchMap(params => this.anemometersService.getAnemometerById(+params['id']))
      );
      this.refreshWindObservables();
      this.countWinds$ = this.windsService.countWinds$;
  }

  private refreshWindObservables(page?: number, pageSize?: number){
    this.winds$ = this.route.params.pipe(
      switchMap(params => this.windsService.getWindsAnemometerByAnemometerId(+params['id'], page, pageSize))
    );
    this.winds$.subscribe( data => {
      this.winds = data,
      this.sortedWinds = this.winds.slice();
    });
  }

  onCreateWind(createdWind: {speed: number, time: Date, anemometer_id:number}){
    this.windsService.createWind(createdWind);
    this.refreshWindObservables();
  }

  onChangePage(eventPage:any){
    this.refreshWindObservables(eventPage.pageIndex+1, eventPage.pageSize);
  }

  onChange(){}

  onDelete(){
    this.anemometer$.pipe(
      take(1),
      tap(anemometer =>{
        this.anemometersService.deleteAnemometer(anemometer.id);
        this.onGoBack();
      })
    ).subscribe();
  }

  onGoBack() {
    this.router.navigateByUrl('/anemometer');
  }

  sortData(sort: Sort) {
    const data = this.winds.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedWinds = data;
      return;
    }

    this.sortedWinds = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'speed':
          return compare(a.speed, b.speed, isAsc);
        case 'time':
          return compare(a.time, b.time, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  if(a instanceof Date && b instanceof Date){
    return (a.getTime() < b.getTime() ? -1 : 1) * (isAsc ? 1 : -1)
  }
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}