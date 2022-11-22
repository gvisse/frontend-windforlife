import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tag } from '../../models/tag.model';

@Component({
  selector: 'app-tag-list-item',
  templateUrl: './tag-list-item.component.html',
  styleUrls: ['./tag-list-item.component.scss']
})
export class TagListItemComponent implements OnInit {

  @Input() tag!: Tag;
  @Output() deletedTag = new EventEmitter<{id :number}>();

  constructor() { }

  ngOnInit(): void {
  }

  onDelete(){
    this.deletedTag.emit({id: this.tag.id});
  }
}
