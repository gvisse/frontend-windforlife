import { Component, Input, OnInit } from '@angular/core';
import { Anemometer } from '../../models/anemometer.model';

@Component({
  selector: 'app-anemometer-list-item',
  templateUrl: './anemometer-list-item.component.html',
  styleUrls: ['./anemometer-list-item.component.scss']
})
export class AnemometerListItemComponent implements OnInit {

  @Input() anemometer!: Anemometer;

  constructor() { }

  ngOnInit(): void {
  }

}