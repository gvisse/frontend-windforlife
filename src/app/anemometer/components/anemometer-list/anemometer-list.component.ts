import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
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
  anemometers$!: Observable<Anemometer[]>

  searchCtrl!: FormControl;
  searchTypeCtrl!: FormControl;
  searchTypeOptions!: {
    value: AnemometerSearchType,
    label: string
  }[];

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
  }

}
