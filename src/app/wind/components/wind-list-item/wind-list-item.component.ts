import { Component, Input, OnInit } from '@angular/core';
import { Wind } from '../../models/wind.model';

@Component({
  selector: 'app-wind-list-item',
  templateUrl: './wind-list-item.component.html',
  styleUrls: ['./wind-list-item.component.scss']
})
export class WindListItemComponent implements OnInit {

  @Input() wind!: Wind;

  constructor() { }

  ngOnInit(): void {
  }

}
