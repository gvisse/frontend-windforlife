import { Component, Input, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Anemometer } from '../../models/anemometer.model';

@Component({
  selector: 'app-anemometer-list-item',
  templateUrl: './anemometer-list-item.component.html',
  styleUrls: ['./anemometer-list-item.component.scss']
})
export class AnemometerListItemComponent implements OnInit {

  @Input() anemometer!: Anemometer;

  constructor(private router: Router, private ngZone: NgZone) { }

  ngOnInit(): void {
  }

  onViewAnemometer(){
    this.ngZone.run(() => this.router.navigateByUrl(`anemometer/${this.anemometer.id}`));
  }

}
