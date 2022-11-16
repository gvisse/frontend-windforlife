import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Anemometer } from '../../models/anemometer.model';

@Component({
  selector: 'app-single-anemometer',
  templateUrl: './single-anemometer.component.html',
  styleUrls: ['./single-anemometer.component.scss']
})
export class SingleAnemometerComponent implements OnInit {

  anemometer!: Anemometer;
  anemometer$!: Observable<Anemometer>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.anemometer$ = this.route.data.pipe(
      map(data => data['anemometer'])
    )
  }

}
