import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { AnemometerSearchType } from '../../enums/anemometer-search-type.enum';
import { Anemometer } from '../../models/anemometer.model';
import { AnemometersService } from '../../services/anemometers.service';

@Component({
  selector: 'app-anemometer-list',
  templateUrl: './anemometer-list.component.html',
  styleUrls: ['./anemometer-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnemometerListComponent implements OnInit {

  loading$!: Observable<boolean>;
  anemometers$!: Observable<Anemometer[]>;
  countAnemometers$!: Observable<number>;

  searchCtrl!: FormControl;
  searchTypeCtrl!: FormControl;
  searchTypeOptions!: {
    value: AnemometerSearchType,
    label: string
  }[];

  pageEvent!: PageEvent;
  length!: number;
  pageSize!: number;
  pageIndex!: number;
  pageSizeOptions = [10, 25, 50, 100];
  showPageSizeOptions = true;
  showFirstLastButtons = true;

  constructor(private anemometersService: AnemometersService,
              private fb: FormBuilder)
  {
  }

  ngOnInit(): void {
    this.initForm();
    this.initObservable();
    this.anemometersService.getAnemometersFromServeur();
  }

  private initForm(){
      this.searchCtrl = this.fb.control('');
      this.searchTypeCtrl = this.fb.control(AnemometerSearchType.NAME);
      this.searchTypeOptions = [
          { value: AnemometerSearchType.NAME, label: 'Nom' },
          { value: AnemometerSearchType.LAT, label: 'Latitude' },
          { value: AnemometerSearchType.LON, label: 'Longitude' },
          { value: AnemometerSearchType.ALT, label: 'Altitude' }
      ];
  }

  private initObservable(){
    const search$ = this.searchCtrl.valueChanges.pipe(
      startWith(this.searchCtrl.value),
      map(value => value.toLowerCase())
    );
    const searchType$: Observable<AnemometerSearchType> = this.searchTypeCtrl.valueChanges.pipe(
        startWith(this.searchTypeCtrl.value)
    );
    this.loading$ = this.anemometersService.loading$;
    this.anemometers$ = combineLatest([
      search$,
      searchType$,
      this.anemometersService.anemometers$
      ]
    ).pipe(
        map(([search, searchType, anemometers]) => anemometers.filter((anemometer:any) => anemometer[searchType]
            .toString()
            .toLowerCase()
            .includes(search as string))
        )
    );
    this.countAnemometers$ = this.anemometersService.countAnemometers$;
  }

  onChangePage(e:PageEvent){
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.anemometersService.goToPage({page: e.pageIndex+1, size: e.pageSize});
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }
}
