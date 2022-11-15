import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Tag } from '../../models/tag.model';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent implements OnInit {

  tags$!: Observable<Tag[]>;
  
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.tags$ = this.route.data.pipe(
      map(data => data['posts']['results'])
    );
  }

}
