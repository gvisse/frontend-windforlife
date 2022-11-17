import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
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

  constructor(private anemometersService: AnemometersService) { }

  ngOnInit(): void {
    this.initObservable();
    this.anemometersService.getAnemometersFromServeur();
  }

  private initObservable(){
    this.loading$ = this.anemometersService.loading$;
    this.anemometers$ = this.anemometersService.anemometers$;
  }

}
