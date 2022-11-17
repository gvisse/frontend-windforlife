import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { Anemometer } from '../../models/anemometer.model';
import { AnemometersService } from '../../services/anemometers.service';

@Component({
  selector: 'app-single-anemometer',
  templateUrl: './single-anemometer.component.html',
  styleUrls: ['./single-anemometer.component.scss']
})
export class SingleAnemometerComponent implements OnInit {

  loading$!: Observable<boolean>;
  anemometer$!: Observable<Anemometer>;

  constructor(private anemometersService: AnemometersService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
      this.initObservables();
  }

  private initObservables() {
      this.loading$ = this.anemometersService.loading$;
      this.anemometer$ = this.route.params.pipe(
        switchMap(params => this.anemometersService.getAnemometerById(+params['id']))
    );
  }

  onChange(){}

  onDelete(){}

  onGoBack() {
    this.router.navigateByUrl('/anemometer');
  }
}
