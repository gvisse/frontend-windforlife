import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Tag } from '../../models/tag.model';
import { TagsService } from '../../services/tags.service';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent implements OnInit {

  tags$!: Observable<Tag[]>;
  countTags$!: Observable<number>;
  loading$!: Observable<boolean>;

  constructor(private tagsService: TagsService) { }

  ngOnInit(): void {
    this.initObservable();
    this.tagsService.getTagsFromServeur();
  }

  private initObservable(){
    this.loading$ = this.tagsService.loading$;
    this.tags$ = this.tagsService.tags$;
    this.countTags$ = this.tagsService.countTags$;
  }

  onDeleteTag(deletedTag: {id: number}){
    this.tagsService.deleteTag(deletedTag.id);
  }

  onCreateTag(createdTag: {name: string}){
    this.tagsService.createTag(createdTag.name);
  }

  onChangePage(eventPage:any){
    console.log(eventPage);
    this.tagsService.goToPage(eventPage.pageIndex+1);
  }
}
