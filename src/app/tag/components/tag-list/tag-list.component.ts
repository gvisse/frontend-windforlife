import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
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

  pageEvent!: PageEvent;
  length!: number;
  pageSize!: number;
  pageIndex!: number;
  pageSizeOptions = [10, 25, 50, 100];
  showPageSizeOptions = true;
  showFirstLastButtons = true;

  constructor(private tagsService: TagsService, public authService: AuthService) { }

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

  onChangePage(e:PageEvent){
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.tagsService.goToPage({page: e.pageIndex+1, size: e.pageSize});
  }
}
