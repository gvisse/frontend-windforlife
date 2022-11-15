import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Anemometer } from '../../models/anemometer.model';

@Component({
  selector: 'app-anemometer-list',
  templateUrl: './anemometer-list.component.html',
  styleUrls: ['./anemometer-list.component.scss']
})
export class AnemometerListComponent implements OnInit {

  anemometers$!: Observable<Anemometer[]>

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.anemometers$ = this.route.data.pipe(
      map(data => data['posts']['results'])
    )
  }

}
