import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Anemometer } from '../../models/anemometer.model';

@Component({
  selector: 'app-anemometer-list-item',
  templateUrl: './anemometer-list-item.component.html',
  styleUrls: ['./anemometer-list-item.component.scss']
})
export class AnemometerListItemComponent implements OnInit {

  @Input() anemometer!: Anemometer;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onViewAnemometer(){
    this.router.navigateByUrl(`anemometer/${this.anemometer.id}`);
  }

}
