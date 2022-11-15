import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Wind } from '../../models/wind.model';

@Component({
  selector: 'app-wind-list',
  templateUrl: './wind-list.component.html',
  styleUrls: ['./wind-list.component.scss']
})
export class WindListComponent implements OnInit {

  winds$!: Observable<Wind[]>;
  
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.winds$ = this.route.data.pipe(
      map(data => data['posts']['results'])
    );
  }

}
