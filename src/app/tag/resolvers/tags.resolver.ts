import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Tag } from '../models/tag.model';
import { TagsService } from '../services/tags.service';
import { Observable } from 'rxjs';

@Injectable()
export class TagsResolver implements Resolve<Tag[]> {
  constructor(private tagsService: TagsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Tag[]> {
    return this.tagsService.getTags();
  }
}